export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#14213d',
        mist: '#f5f7fb',
        coral: '#ef6f6c',
        pine: '#0f766e',
        saffron: '#f59e0b'
      },
      boxShadow: {
        premium: '0 18px 50px rgba(15, 23, 42, 0.10)'
      }
    }
  },
  plugins: []
};
