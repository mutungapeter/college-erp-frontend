import { IoCheckmarkCircleOutline, IoCloseOutline } from "react-icons/io5";
import { PiSpinnerGap } from "react-icons/pi";
import { FaExclamation } from "react-icons/fa6";


interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  confirmationMessage?: string;
  deleteMessage: string;
  isDeleting?: boolean;
  title?: string;
  actionText?: string;
  actionType?: "delete" | "submit" | "create" | "update" | "cancel" ; 
}

const ActionModal = ({
  isOpen,
  onClose,
  onDelete,
  confirmationMessage,
  deleteMessage,
  isDeleting,
  title,
  actionText,
  actionType = "delete",
}: ActionModalProps) => {
  if (!isOpen) return null;
  
  return (
    <>
      <div
        className="relative z-9999 animate-fadeIn"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn"
          aria-hidden="true"
        ></div>

        <div className="fixed inset-0 z-9999 w-screen overflow-y-auto font-nunito">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-lg p-6">
              <div className="flex items-center mb-4">
                <div className={`flex-shrink-0 rounded-full p-2 mr-3 ${
                  actionType === "delete" ? "bg-red-100" : 
                  actionType === "cancel" ? "bg-red-100" :
                  actionType === "update" ? "bg-blue-100" : 
                  "bg-green-100"
                }`}>
                  {actionType === "delete" || actionType === "cancel" ? (
                    <FaExclamation className="h-6 w-6 text-red-600" />
                  ) : actionType === "update" ? (
                    <IoCheckmarkCircleOutline className="h-6 w-6 text-blue-600" />
                  ) : (
                    <IoCheckmarkCircleOutline className="h-6 w-6 text-green-600" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {title || (actionType === "delete" ? "Confirm Deletion" : "Confirm Action")}
                </h3>

                <div
                  className="absolute top-4 right-4 cursor-pointer"
                  onClick={onClose}
                >
                  <IoCloseOutline className="h-9 w-9 text-gray-500 hover:text-gray-500 transition-colors" />
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 rounded-lg mb-5">
                <p className="text-sm text-gray-600">
                  {confirmationMessage}
                  <span className="font-medium text-gray-900 block mt-1">
                    {deleteMessage}
                  </span>
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onDelete}
                  disabled={isDeleting}
                  type="button"
                  className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white
                    transition-colors disabled:opacity-75 ${
                      actionType === "delete" || actionType === "cancel" ? "bg-red-600 hover:bg-red-700" : 
                      actionType === "update" ? "bg-blue-600 hover:bg-blue-700" : 
                      "bg-green-600 hover:bg-green-700"
                    }`}
                >
                  {isDeleting ? (
                    <span className="flex items-center">
                      <PiSpinnerGap className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      {actionText ? `${actionText}ing...` : 
                      
                        actionType === "delete" ? "Deleting..." :
                        actionType === "cancel" ? "Cancelling..." :
                        actionType === "submit" ? "Submitting..." :
                        actionType === "create" ? "Creating..." :
                        "Updating..."}
                    </span>
                  ) : (
                    actionText || (
                      actionType === 'cancel' ? 'Cancel' 
                      : actionType === 'submit' ? 'Submit'
                       : actionType === 'create' ? 'Create' 
                       : actionType === 'update' ? 'Update' 
                       : actionType === 'delete' ? 'Delete'
                       : "Save"  
                    )
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActionModal;