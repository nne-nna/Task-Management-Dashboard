import React from 'react';
import { Mail, Phone, MessageSquare } from 'lucide-react';
import { useThemeContext } from '../context/ThemeContext';

const HelpAndSupportPage: React.FC = () => {
  const { isDark } = useThemeContext();

  const faqs = [
    {
      question: "How do I add a new task?",
      answer: "Click on the 'Add New Task' button on the dashboard. A form will appear where you can enter the task title, description, due date, and priority.",
    },
    {
      question: "Can I edit an existing task?",
      answer: "Yes, click the 'Edit' icon (pencil) on the task card you wish to modify. The task form will pre-fill with the existing details.",
    },
    {
      question: "How do I mark a task as complete?",
      answer: "Click the 'Check' icon on the task card. The task's status will toggle between 'pending' and 'completed'.",
    },
    {
      question: "What does 'overdue' mean?",
      answer: "A task is marked as 'overdue' if its due date has passed and it has not been marked as 'completed'.",
    },
  ];

  return (
    <div
      className={`flex-1 p-8 min-h-screen ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <div className="max-w-full mx-auto">
        <h2
          className={`text-3xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Help & Support
        </h2>

        <div
          className={`rounded-xl p-6 shadow-sm border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } mb-6`}
        >
          <h3
            className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border-b pb-4 last:border-b-0 ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <h4
                  className={`font-semibold text-lg ${
                    isDark ? 'text-white' : 'text-gray-900'
                  } mb-2`}
                >
                  {faq.question}
                </h4>
                <p
                  className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`rounded-xl p-6 shadow-sm border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          <h3
            className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            Contact Us
          </h3>
          <div
            className={`space-y-3 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            <p className="flex items-center">
              <Mail
                size={20}
                className={`${isDark ? 'text-blue-400' : 'text-blue-500'} mr-3`}
              />
              Email:{' '}
              <a
                href=""
                className={`ml-2 ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'
                } hover:underline`}
              >
                support@taskflow.com
              </a>
            </p>
            <p className="flex items-center">
              <Phone
                size={20}
                className={`${isDark ? 'text-blue-400' : 'text-blue-500'} mr-3`}
              />
              Phone:{' '}
              <a
                href=""
                className={`ml-2 ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'
                } hover:underline`}
              >
                +1 (234) 567-890
              </a>
            </p>
            <p className="flex items-center">
              <MessageSquare
                size={20}
                className={`${isDark ? 'text-blue-400' : 'text-blue-500'} mr-3`}
              />
              Live Chat: Available during business hours (9 AM - 5 PM WAT)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupportPage;