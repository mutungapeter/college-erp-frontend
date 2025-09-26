import SubmitSpinner from "./spinners/submitSpinner";

type StickyFooterProps = {
  onCancel: () => void;
  isSubmitting: boolean;
  isProcessing: boolean; 
};

const ModalBottomButton: React.FC<StickyFooterProps> = ({
  onCancel,
  isSubmitting,
  isProcessing,
}) => {
  return (
    <div className="sticky bottom-0 bg-white z-40 flex px-2 
     md:justify-between items-center py-3">
      <button
        type="button"
        onClick={onCancel}
        className="border border-red-500
         bg-white shadow-sm text-red-500 py-2 
         md:text-lg text-sm px-4 rounded-lg w-full min-w-[180px] md:w-auto hover:bg-red-500 hover:text-white"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting || isProcessing}
        className="bg-primary min-w-[180px] text-white py-2
         hover:bg-primary-700  md:text-lg text-sm  px-4 rounded-md w-full
          md:w-auto"
      >
        {isSubmitting || isProcessing ? (
          <span className="flex items-center">
            <SubmitSpinner />
            <span>Submitting...</span>
          </span>
        ) : (
          <span>Submit</span>
        )}
      </button>
    </div>
  );
};
export default ModalBottomButton;