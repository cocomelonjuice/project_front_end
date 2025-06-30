const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Project Setup
        </h2>
        <p className="text-gray-600 mb-6">
          This project demonstrates a modern React application setup with the following technologies:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li><strong>React 18</strong> - Latest version of React with modern features</li>
          <li><strong>Vite</strong> - Fast build tool and development server</li>
          <li><strong>TypeScript</strong> - Type-safe JavaScript development</li>
          <li><strong>Tailwind CSS</strong> - Utility-first CSS framework</li>
          <li><strong>Redux Toolkit</strong> - Modern Redux with simplified setup</li>
          <li><strong>React Router</strong> - Client-side routing for React</li>
        </ul>
      </div>
    </div>
  );
};

export default About; 