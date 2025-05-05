import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  FileText,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  User,
  Calendar as CalendarIcon,
  ChevronsRight,
  Loader2
} from "lucide-react";

const CreateLeave = () => {
  const [formData, setFormData] = useState({
    leaveType: "sick",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [daysCount, setDaysCount] = useState(0);
  const navigate = useNavigate();

  // Calculate days between dates
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDaysCount(diffDays);
    }
  }, [formData.startDate, formData.endDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/leaves", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/employee-home", { state: { leaveCreated: true } });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit leave request");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Leave type options with icons
  const leaveOptions = [
    { value: "sick", label: "Sick Leave", bg: "bg-red-100", icon: <AlertCircle className="h-6 w-6 text-red-500" /> },
    { value: "vacation", label: "Vacation", bg: "bg-blue-100", icon: <CalendarIcon className="h-6 w-6 text-blue-500" /> },
    { value: "personal", label: "Personal Leave", bg: "bg-purple-100", icon: <User className="h-6 w-6 text-purple-500" /> },
    { value: "other", label: "Other", bg: "bg-gray-100", icon: <FileText className="h-6 w-6 text-gray-500" /> },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 transform transition-all duration-500 scale-100 animate-fadeIn">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Submitted!</h2>
            <p className="text-gray-600 mb-6">Your leave request has been successfully submitted and is pending approval.</p>
            <div className="animate-pulse">
              <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-white hover:text-blue-200 transition-colors"
            >
              <ArrowLeft size={20} className="mr-1" />
              Back
            </button>
            <h1 className="text-2xl font-bold">New Leave Request</h1>
            <div className="w-8"></div> {/* Empty div for alignment */}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
          <div className="flex items-center w-full">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              1
            </div>
            <div className={`h-1 flex-1 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              2
            </div>
            <div className={`h-1 flex-1 mx-2 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              3
            </div>
          </div>
        </div>

        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Leave Type */}
          <div className={currentStep === 1 ? "block animate-fadeIn" : "hidden"}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Leave Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {leaveOptions.map((option) => (
                <div 
                  key={option.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${formData.leaveType === option.value ? 'border-blue-500 shadow-md' : 'border-gray-200'} ${option.bg}`}
                  onClick={() => setFormData({...formData, leaveType: option.value})}
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{option.label}</h3>
                    </div>
                    {formData.leaveType === option.value && (
                      <CheckCircle className="ml-auto h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
              >
                Next Step <ChevronsRight className="ml-1 h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Step 2: Date Selection */}
          <div className={currentStep === 2 ? "block animate-fadeIn" : "hidden"}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Leave Dates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  End Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={
                      formData.startDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 text-blue-700 flex items-center animate-fadeIn">
                <Clock className="h-5 w-5 mr-2" />
                <span>
                  {daysCount} day{daysCount !== 1 && 's'} of leave requested
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="text-gray-600 py-2 px-6 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors flex items-center"
              >
                <ArrowLeft className="mr-1 h-5 w-5" /> Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
                disabled={!formData.startDate || !formData.endDate}
              >
                Next Step <ChevronsRight className="ml-1 h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Step 3: Reason */}
          <div className={currentStep === 3 ? "block animate-fadeIn" : "hidden"}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Provide Reason</h2>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Reason for Leave
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={4}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Please provide details about your leave request..."
                  required
                />
              </div>
            </div>

            {/* Summary */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Request Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Leave Type:</div>
                <div className="font-medium text-gray-900 capitalize">{formData.leaveType}</div>
                
                <div className="text-gray-600">Start Date:</div>
                <div className="font-medium text-gray-900">{formData.startDate}</div>
                
                <div className="text-gray-600">End Date:</div>
                <div className="font-medium text-gray-900">{formData.endDate}</div>
                
                <div className="text-gray-600">Duration:</div>
                <div className="font-medium text-gray-900">{daysCount} day{daysCount !== 1 && 's'}</div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="text-gray-600 py-2 px-6 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors flex items-center"
              >
                <ArrowLeft className="mr-1 h-5 w-5" /> Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.reason}
                className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Decorative elements */}
      <div className="fixed top-0 right-0 -z-10 opacity-10">
        <svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" fill="#4f46e5" />
        </svg>
      </div>
      <div className="fixed bottom-0 left-0 -z-10 opacity-10">
        <svg width="300" height="300" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="80" rx="10" fill="#4f46e5" />
        </svg>
      </div>
    </div>
  );
};

export default CreateLeave;