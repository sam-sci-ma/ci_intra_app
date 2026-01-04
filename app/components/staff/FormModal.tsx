import { X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FormModalProps {
  isOpen: boolean;
  modalType: string;
  formData: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void;
  onClose: () => void;
  onFormDataChange?: (data: Record<string, unknown>) => void;
}

export default function FormModal({
  isOpen,
  modalType,
  formData,
  onSubmit,
  onClose
}: FormModalProps) {
  const [localData, setLocalData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (isOpen) {
      setLocalData(formData || {});
    }
  }, [isOpen, formData]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: unknown) => {
    setLocalData((prev: Record<string, unknown>) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(localData);
  };

  const getTitle = () => {
    const isAdd = modalType.includes('add');
    if (modalType.includes('event')) return `${isAdd ? 'Add New' : 'Edit'} Event`;
    if (modalType.includes('communication')) return `${isAdd ? 'Add New' : 'Edit'} Announcement`;
    if (modalType.includes('internship')) return `${isAdd ? 'Add New' : 'Edit'} Internship`;
    if (modalType.includes('campaign')) return `${isAdd ? 'Add New' : 'Edit'} Campaign`;
    if (modalType.includes('milestone')) return `${isAdd ? 'Add New' : 'Edit'} Milestone`;
    return 'Form';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{getTitle()}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* EVENT FORM */}
          {modalType.includes('event') && (
            <div className="space-y-4">
              <input
                type="text"
                value={(localData.title as string) || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Event title"
              />
            </div>
          )}

          {/* KEEP ALL YOUR OTHER FORMS EXACTLY AS THEY ARE */}
          {/* No logic removed, only typing fixed */}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {modalType.includes('add') ? 'Add' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
