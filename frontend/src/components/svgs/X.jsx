const XSvg = (props) => (
	<img
	  src="/images/logos.jpg" // Replace with the actual path to your image
	  alt="Custom Logo"
	  className="w-10 h-10 object-contain float-left margin-left:50px " // DaisyUI and Tailwind CSS utilities for styling
	  {...props} // Spread other props for flexibility
	/>
  );
  
  export default XSvg;
  