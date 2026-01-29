const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/backgroundImage.jpg')" }}
    >
      <h1 className="text-3xl font-bold mb-3 bg-[#f0f0f0] py-2 px-4 rounded-lg">
        404 - Page Not Found
      </h1>

      <button
        onClick={() => navigate("/signin")}
        className="text-blue-600 hover:underline text-lg bg-[#f0f0f0] py-2 px-4 rounded-lg"
      >
        Go to Login page
      </button>
    </div>
  );
};
export default NotFound;
