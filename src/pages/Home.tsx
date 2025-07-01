import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Button from '@mui/material/Button';

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Welcome to Your React App
      </h1>
      <Button variant="contained" color="secondary">
        Click me
      </Button>
      <p className="text-lg text-gray-600 mb-8">
        This is a React application built with Vite, TypeScript, Tailwind CSS, Redux Toolkit, and React Router.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Vite</h3>
          <p className="text-gray-600">Fast build tool and development server</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">TypeScript</h3>
          <p className="text-gray-600">Type-safe JavaScript development</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Tailwind CSS</h3>
          <p className="text-gray-600">Utility-first CSS framework</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 