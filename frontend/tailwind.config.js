// module.exports = {
//   darkMode: 'class',
//   content: ["./src/**/*.{js,jsx}"],
//   theme: {
//     extend: {
//       animation: {
//         'fade-in': 'fadeIn 0.6s ease-in-out',
//         'slide-down': 'slideDown 0.6s ease-in-out',
//       },
//       keyframes: {
//         fadeIn: {
//           '0%': { opacity: 0 },
//           '100%': { opacity: 1 },
//         },
//         slideDown: {
//           '0%': { transform: 'translateY(-10px)', opacity: 0 },
//           '100%': { transform: 'translateY(0)', opacity: 1 },
//         },
//       },
//     },
//   },
//   plugins: [],
// }



module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-down': 'slideDown 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-12px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
