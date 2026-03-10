import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent, MouseEvent, KeyboardEvent } from 'react';

export default function Form() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState(() => {
    if (typeof window === 'undefined') return {
      firstName: '', lastName: '', email: '', phone: '',
      songFor: '', relationship: '', musicPreferences: '', fiveThings: '',
      insideJokes: '', existingSongs: '', threeThings: '', keyMessage: '',
      wordsToliveBy: '', productionDate: ''
    };
    const saved = localStorage.getItem('songQuestionnaireFormData');
    return saved ? JSON.parse(saved) : {
      firstName: '', lastName: '', email: '', phone: '',
      songFor: '', relationship: '', musicPreferences: '', fiveThings: '',
      insideJokes: '', existingSongs: '', threeThings: '', keyMessage: '',
      wordsToliveBy: '', productionDate: ''
    };
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('songQuestionnaireFormData', JSON.stringify(formData));
  }, [formData]);

  // Load currentPage from localStorage on mount
  useEffect(() => {
    const savedPage = localStorage.getItem('songQuestionnairePage');
    if (savedPage) {
      setCurrentPage(parseInt(savedPage));
    }
  }, []);

  // Save currentPage to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('songQuestionnairePage', currentPage.toString());
  }, [currentPage]);

  // Clear localStorage after successful submission
  useEffect(() => {
    if (isSuccess) {
      localStorage.removeItem('songQuestionnaireFormData');
      localStorage.removeItem('songQuestionnairePage');
    }
  }, [isSuccess]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePage1 = () => {
    return formData.firstName.trim() &&
           formData.lastName.trim() &&
           formData.email.trim() &&
           formData.phone.trim();
  };

  const validatePage2 = () => {
    return true; // All fields on page 2 are optional
  };

  const validatePage3 = () => {
    return true; // All fields on page 3 are optional
  };

  const handleNext = (e?: MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (currentPage === 1 && !validatePage1()) {
      setError('Please fill in all required fields on this page');
      return;
    }
    if (currentPage === 2 && !validatePage2()) {
      setError('Please complete all fields on this page');
      return;
    }
    setError('');
    setCurrentPage(currentPage + 1);
  };

  const handleBack = (e?: MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    setError('');
    setCurrentPage(currentPage - 1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && currentPage < 3) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/song-questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          songFor: formData.songFor,
          relationship: formData.relationship,
          musicPreferences: formData.musicPreferences,
          fiveThings: formData.fiveThings,
          insideJokes: formData.insideJokes,
          existingSongs: formData.existingSongs,
          threeThings: formData.threeThings,
          keyMessage: formData.keyMessage,
          wordsToliveBy: formData.wordsToliveBy,
          productionDate: formData.productionDate
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit questionnaire');
      }

      setIsSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        songFor: '',
        relationship: '',
        musicPreferences: '',
        fiveThings: '',
        insideJokes: '',
        existingSongs: '',
        threeThings: '',
        keyMessage: '',
        wordsToliveBy: '',
        productionDate: ''
      });
      setCurrentPage(1);
    } catch (err) {
      setError('There was an error submitting your questionnaire. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2">Thanks {formData.firstName}!</h2>
        <p className="text-gray-700 mb-4">Your custom song questionnaire has been submitted.</p>
        <p className="text-gray-700 mb-6">Ernie will review your answers and get back to you shortly at <strong>{formData.email}</strong>.</p>

        <button
          onClick={() => setIsSuccess(false)}
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Submit another questionnaire
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      {/* Page Navigation */}
      <div className="mb-8 flex justify-center items-center gap-2">
        {[1, 2, 3].map(page => (
          <div key={page} className="flex items-center">
            <button
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-colors ${
                currentPage === page
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
            {page < 3 && <div className="w-8 h-0.5 bg-gray-300 mx-1"></div>}
          </div>
        ))}
      </div>

      {/* Intro Message */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8">
        <p className="text-gray-800 leading-relaxed">
          Here's where I get to ask you all about the custom song we are going to create. <strong>Please be as detailed with your answers as possible</strong> as they will make the best and most personal songs. Give me more than I'll need (street names, what you were drinking, what song that was on the radio, etc). <strong>Describe things using images (and sounds) when you can.</strong> Imagine we are making a short movie and you need to describe the scene and the characters so I can re-create it.
        </p>
      </div>

      {/* Page 1: Contact Information */}
      {currentPage === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="First"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="Last"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Song</h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="songFor" className="block text-sm font-medium text-gray-700 mb-1">
                  Who will your custom song be written for?
                </label>
                <textarea
                  id="songFor"
                  name="songFor"
                  rows={4}
                  value={formData.songFor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-y"
                  placeholder="A person, a group, a company, a place, even yourself!"
                />
              </div>

              <div>
                <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
                  What is your relationship?
                </label>
                <textarea
                  id="relationship"
                  name="relationship"
                  rows={4}
                  value={formData.relationship}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-y"
                  placeholder="If it's a person, tell me how you know them, how you met. What your first impression was, etc."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page 2: Song Details */}
      {currentPage === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Song Details</h2>

          <div>
            <label htmlFor="musicPreferences" className="block text-sm font-medium text-gray-700 mb-1">
              What kind of music do they / you listen to?
            </label>
            <textarea
              id="musicPreferences"
              name="musicPreferences"
              rows={4}
              value={formData.musicPreferences}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-y"
              placeholder="Favorite artists, songs, etc."
            />
          </div>

          <div>
            <label htmlFor="fiveThings" className="block text-sm font-medium text-gray-700 mb-1">
              What are 5 things you love about them and why?
            </label>
            <textarea
              id="fiveThings"
              name="fiveThings"
              rows={4}
              value={formData.fiveThings}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-y"
              placeholder="Can you give me examples/stories of times they exhibited those qualities?"
            />
          </div>

          <div>
            <label htmlFor="insideJokes" className="block text-sm font-medium text-gray-700 mb-1">
              Any inside jokes, nicknames?
            </label>
            <textarea
              id="insideJokes"
              name="insideJokes"
              rows={4}
              value={formData.insideJokes}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-y"
            />
          </div>

          <div>
            <label htmlFor="existingSongs" className="block text-sm font-medium text-gray-700 mb-1">
              If there was a song(s) already written about your relationship, what would they be?
            </label>
            <textarea
              id="existingSongs"
              name="existingSongs"
              rows={4}
              value={formData.existingSongs}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-y"
              placeholder="This question helps me pick a stylistic direction as a jumping off point."
            />
          </div>
        </div>
      )}

      {/* Page 3: Final Questions */}
      {currentPage === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Final Details</h2>

          <div>
            <label htmlFor="threeThings" className="block text-sm font-medium text-gray-700 mb-1">
              Name 3 things they couldn't live without.
            </label>
            <textarea
              id="threeThings"
              name="threeThings"
              rows={4}
              value={formData.threeThings}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-y"
            />
          </div>

          <div>
            <label htmlFor="keyMessage" className="block text-sm font-medium text-gray-700 mb-1">
              The one thing this song needs to say.
            </label>
            <textarea
              id="keyMessage"
              name="keyMessage"
              rows={4}
              value={formData.keyMessage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-y"
              placeholder="If this song could only convey 1 sentiment or message, what would it be?"
            />
          </div>

          <div>
            <label htmlFor="wordsToliveBy" className="block text-sm font-medium text-gray-700 mb-1">
              What are their words to live by?
            </label>
            <textarea
              id="wordsToliveBy"
              name="wordsToliveBy"
              rows={4}
              value={formData.wordsToliveBy}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-y"
              placeholder="Do they have a life motto or expression that would sum up how they look at the world?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Scheduled Production Date?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="productionDatePicker" className="block text-xs font-medium text-gray-600 mb-2">
                  Date Picker
                </label>
                <input
                  type="date"
                  id="productionDatePicker"
                  value={formData.productionDate}
                  onChange={(e) => handleChange({
                    target: { name: 'productionDate', value: e.target.value }
                  } as ChangeEvent<HTMLInputElement>)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="productionDateText" className="block text-xs font-medium text-gray-600 mb-2">
                  Or write it out
                </label>
                <textarea
                  id="productionDateText"
                  name="productionDate"
                  value={formData.productionDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors resize-none"
                  placeholder="e.g., 'Summer 2025' or 'Q4 2025'"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm mb-6 mt-6">
          {error}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        {currentPage > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-colors"
          >
            Back
          </button>
        )}

        {currentPage < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        )}
      </div>
    </form>
  );
}
