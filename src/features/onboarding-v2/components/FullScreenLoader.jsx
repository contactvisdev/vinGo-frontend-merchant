import ClipLoader from "react-spinners/ClipLoader";

export default function FullScreenLoader({ loading }) {
  if (!loading) return null;
  return (
    <div className="fixed inset-0 bg-white/60 flex items-center justify-center z-50">
      <ClipLoader
        size={40}
        color="#ff69b4"
        cssOverride={{ borderWidth: "4px" }}
      />
    </div>
  );
}
