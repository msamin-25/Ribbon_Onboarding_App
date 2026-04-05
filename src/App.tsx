import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft, 
  Building2, 
  User, 
  Mail, 
  MapPin, 
  CreditCard, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

// Types
interface RegistrationFormData {
  businessName: string;
  ownerFullName: string;
  ownerEmail: string;
  businessAddress: string;
}

type Step = 1 | 2 | 3 | 4;
const STEPS: Step[] = [1, 2, 3, 4];
const ALL_FIELDS: Array<keyof RegistrationFormData> = [
  'businessName',
  'ownerFullName',
  'ownerEmail',
  'businessAddress',
];

export default function App() {
  // State Variables
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<RegistrationFormData>({
    businessName: '',
    ownerFullName: '',
    ownerEmail: '',
    businessAddress: '',
  });
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [rejectionError, setRejectionError] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Set<keyof RegistrationFormData>>(new Set());

  // Validation
  const errors = useMemo(() => {
    const newErrors: Partial<Record<keyof RegistrationFormData, string>> = {};
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.ownerFullName.trim()) newErrors.ownerFullName = 'Owner full name is required';
    if (!formData.ownerEmail.trim()) {
      newErrors.ownerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
      newErrors.ownerEmail = 'Invalid email format';
    }
    if (!formData.businessAddress.trim()) newErrors.businessAddress = 'Business address is required';
    return newErrors;
  }, [formData]);

  const isStep1Valid = Object.keys(errors).length === 0;
  const isStep2Valid = isPaymentComplete;

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    const name = e.target.name as keyof RegistrationFormData;
    setFormData(prev => ({ ...prev, [name]: value }));
    setRejectionError(null); // Clear rejection error if they start typing
  };

  const handleBlur = (field: keyof RegistrationFormData) => {
    setTouchedFields(prev => new Set(prev).add(field));
  };

  const nextStep = () => {
    if (currentStep === 1 && !isStep1Valid) {
      // Mark all fields as touched to show errors
      setTouchedFields(new Set<keyof RegistrationFormData>(ALL_FIELDS));
      return;
    }
    if (currentStep === 2 && !isStep2Valid) return;
    
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = () => {
    if (!hasAttemptedSubmit) {
      // Simulate rejection on first attempt
      setRejectionError(`Registration rejected: business name "${formData.businessName}" conflicts with an existing registration.`);
      setHasAttemptedSubmit(true);
    } else {
      // Success on second attempt
      setRejectionError(null);
      setCurrentStep(4);
    }
  };

  const handleFixRejection = () => {
    setCurrentStep(1);
    setTouchedFields(new Set<keyof RegistrationFormData>(['businessName']));
  };

  // Sub-components
  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8 px-2">
      {STEPS.map((step) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                currentStep >= step 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-400'
              }`}
            >
              {currentStep > step ? <CheckCircle2 size={20} /> : step}
            </div>
            <span className={`text-xs mt-2 font-medium ${currentStep >= step ? 'text-blue-600' : 'text-gray-400'}`}>
              {step === 1 && 'Business'}
              {step === 2 && 'Payment'}
              {step === 3 && 'Review'}
              {step === 4 && 'Done'}
            </span>
          </div>
          {step < 4 && (
            <div className={`flex-1 h-0.5 mx-2 mb-6 transition-colors duration-300 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
          )}
        </React.Fragment> // step + connector line
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Business Registration</h1>
          <p className="mt-2 text-gray-600">Register your sole proprietorship with Ribbon</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            {currentStep < 4 && <StepIndicator />}

            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="text-blue-600" size={24} />
                    Business Information
                  </h2>
                  
                  {rejectionError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
                      <div>
                        <p className="text-sm text-red-800 font-medium">{rejectionError}</p>
                        <p className="text-xs text-red-600 mt-1">Please choose a unique business name to proceed.</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('businessName')}
                        className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                          touchedFields.has('businessName') && errors.businessName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="e.g. Acme Services"
                      />
                      {touchedFields.has('businessName') && errors.businessName && (
                        <p className="mt-1 text-xs text-red-600">{errors.businessName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Owner Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                          type="text"
                          name="ownerFullName"
                          value={formData.ownerFullName}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('ownerFullName')}
                          className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                            touchedFields.has('ownerFullName') && errors.ownerFullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {touchedFields.has('ownerFullName') && errors.ownerFullName && (
                        <p className="mt-1 text-xs text-red-600">{errors.ownerFullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Owner Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                          type="email"
                          name="ownerEmail"
                          value={formData.ownerEmail}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('ownerEmail')}
                          className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                            touchedFields.has('ownerEmail') && errors.ownerEmail ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {touchedFields.has('ownerEmail') && errors.ownerEmail && (
                        <p className="mt-1 text-xs text-red-600">{errors.ownerEmail}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                        <textarea
                          name="businessAddress"
                          value={formData.businessAddress}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur('businessAddress')}
                          rows={3}
                          className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                            touchedFields.has('businessAddress') && errors.businessAddress ? 'border-red-500 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="123 Maple St, Toronto, ON"
                        />
                      </div>
                      {touchedFields.has('businessAddress') && errors.businessAddress && (
                        <p className="mt-1 text-xs text-red-600">{errors.businessAddress}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="text-blue-600" size={24} />
                    Payment
                  </h2>
                  <p className="text-gray-600">Please confirm your registration fee payment of $50.00 CAD.</p>
                  
                  <div className={`p-6 rounded-xl border-2 transition-all ${
                    isPaymentComplete ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isPaymentComplete ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <CreditCard size={24} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Registration Fee</p>
                          <p className="text-sm text-gray-500">One-time payment</p>
                        </div>
                      </div>
                      <p className="text-xl font-bold text-gray-900">$50.00</p>
                    </div>
                    
                    {!isPaymentComplete ? (
                      <button
                        onClick={() => setIsPaymentComplete(true)}
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm"
                      >
                        Confirm Payment
                      </button>
                    ) : (
                      <div className="mt-6 flex items-center justify-center gap-2 text-green-600 font-semibold">
                        <CheckCircle2 size={20} />
                        Payment Confirmed
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>
                  <p className="text-gray-600">Please verify your information before final submission.</p>

                  {rejectionError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
                        <div>
                          <p className="text-sm text-red-800 font-bold">Registration Rejected</p>
                          <p className="text-sm text-red-700 mt-1">{rejectionError}</p>
                        </div>
                      </div>
                      <button 
                        onClick={handleFixRejection}
                        className="mt-3 text-sm font-semibold text-red-700 hover:text-red-800 flex items-center gap-1"
                      >
                        <ChevronLeft size={16} /> Fix Business Name
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Business Details</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Name</span>
                          <span className={`text-sm font-medium ${rejectionError ? 'text-red-600' : 'text-gray-900'}`}>
                            {formData.businessName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Address</span>
                          <span className="text-sm text-gray-900 text-right max-w-[200px]">{formData.businessAddress}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Owner Details</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Full Name</span>
                          <span className="text-sm text-gray-900">{formData.ownerFullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Email</span>
                          <span className="text-sm text-gray-900">{formData.ownerEmail}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Payment Status</p>
                        <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                          <CheckCircle2 size={14} /> Confirmed
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-900">$50.00</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-6"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={48} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Registration Complete!</h2>
                    <p className="mt-2 text-gray-600">
                      Your business <strong>{formData.businessName}</strong> has been successfully registered.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 text-left">
                    <p className="font-semibold mb-1">Next Steps:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Check your email ({formData.ownerEmail}) for confirmation</li>
                      <li>Download your registration certificate</li>
                      <li>Set up your business bank account</li>
                    </ul>
                  </div>
                  <button 
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                  >
                    Start another registration <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer Actions */}
            {currentStep < 4 && (
              <div className="mt-10 flex items-center justify-between pt-6 border-t border-gray-100">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-1 font-semibold transition-colors ${
                    currentStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ChevronLeft size={20} /> Back
                </button>
                
                {currentStep === 3 ? (
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-md active:scale-95"
                  >
                    Submit Registration
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    disabled={(currentStep === 2 && !isPaymentComplete)}
                    className={`flex items-center gap-1 font-bold py-3 px-8 rounded-lg transition-all shadow-md active:scale-95 ${
                      (currentStep === 2 && !isPaymentComplete)
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Next <ChevronRight size={20} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <p className="mt-8 text-center text-sm text-gray-400">
          &copy; 2026 Ribbon Business Services. All rights reserved.
        </p>
      </div>
    </div>
  );
}
