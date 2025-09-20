export default function LoaderSpinner() {
  return (
    <div className="flex w-full h-full justify-center items-center">
      <div className="w-16 h-16 border-8 border-emerald-300 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );
}