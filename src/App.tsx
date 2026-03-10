import Form from './components/Form';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
            Custom Song Questionnaire
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Here's where I get to ask you all about the custom song we are going to create. Please be as detailed with your answers as possible as they will make the best and most personal songs.
          </p>
        </div>

        <Form />

        <div className="mt-12 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Ernie Halter Music. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
