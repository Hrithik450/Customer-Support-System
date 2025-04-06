const CircularLoader = ({ color }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`w-5 h-5 border-2 border-${color}-500 border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default CircularLoader;
