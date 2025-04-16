
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Type, AlignLeft, CheckSquare, List, Radio, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

type FormElementType = 'heading' | 'text' | 'textbox' | 'dropdown' | 'checkbox' | 'radio' | 'richtext';

interface FormElement {
  id: string;
  type: FormElementType;
  content: {
    label?: string;
    text?: string;
    options?: string[];
  };
}

const FormBuilder: React.FC = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [formName, setFormName] = useState('');

  // Generate unique ID for form elements
  const generateId = () => `element_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const addElement = (type: FormElementType) => {
    const newElement: FormElement = {
      id: generateId(),
      type,
      content: {
        label: type === 'heading' ? 'New Heading' : 'New Field',
        text: '',
        options: type === 'dropdown' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined
      }
    };

    setFormElements([...formElements, newElement]);
  };

  const updateElement = (id: string, updatedContent: any) => {
    setFormElements(prevElements => 
      prevElements.map(el => 
        el.id === id ? { ...el, content: { ...el.content, ...updatedContent } } : el
      )
    );
  };

  const removeElement = (id: string) => {
    setFormElements(prevElements => prevElements.filter(el => el.id !== id));
  };

  const handleSave = () => {
    // In a real app, this would save to a database
    console.log('Saving form:', { name: formName, elements: formElements });
    
    // Navigate back to admin dashboard
    navigate('/admin/dashboard');
  };

  const renderFormElement = (element: FormElement) => {
    const { id, type, content } = element;

    switch (type) {
      case 'heading':
        return (
          <div className="relative p-4 border rounded-md mb-4 bg-gray-50">
            <button 
              onClick={() => removeElement(id)} 
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <X size={16} />
            </button>
            <input
              type="text"
              value={content.text || content.label || ''}
              onChange={(e) => updateElement(id, { text: e.target.value })}
              className="w-full px-3 py-2 text-xl font-bold bg-transparent border-b border-dashed focus:outline-none focus:border-blue-500"
              placeholder="Enter heading text"
            />
          </div>
        );

      case 'text':
        return (
          <div className="relative p-4 border rounded-md mb-4 bg-white">
            <button 
              onClick={() => removeElement(id)} 
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <X size={16} />
            </button>
            <input
              type="text"
              value={content.text || ''}
              onChange={(e) => updateElement(id, { text: e.target.value })}
              className="w-full px-3 py-2 bg-transparent border-b border-dashed focus:outline-none focus:border-blue-500"
              placeholder="Enter static text"
            />
          </div>
        );

      case 'textbox':
        return (
          <div className="relative p-4 border rounded-md mb-4 bg-white">
            <button 
              onClick={() => removeElement(id)} 
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <X size={16} />
            </button>
            <input
              type="text"
              value={content.label || ''}
              onChange={(e) => updateElement(id, { label: e.target.value })}
              className="w-full px-3 py-2 mb-2 bg-transparent border-b border-dashed focus:outline-none focus:border-blue-500"
              placeholder="Enter field label"
            />
            <input
              type="text"
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              placeholder="Text input field (preview)"
            />
          </div>
        );

      case 'dropdown':
        return (
          <div className="relative p-4 border rounded-md mb-4 bg-white">
            <button 
              onClick={() => removeElement(id)} 
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <X size={16} />
            </button>
            <input
              type="text"
              value={content.label || ''}
              onChange={(e) => updateElement(id, { label: e.target.value })}
              className="w-full px-3 py-2 mb-2 bg-transparent border-b border-dashed focus:outline-none focus:border-blue-500"
              placeholder="Enter dropdown label"
            />
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
              {content.options?.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Options (one per line):</p>
              <textarea
                value={content.options?.join('\n')}
                onChange={(e) => updateElement(id, { options: e.target.value.split('\n') })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div className="relative p-4 border rounded-md mb-4 bg-white">
            <button 
              onClick={() => removeElement(id)} 
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <X size={16} />
            </button>
            <input
              type="text"
              value={content.label || ''}
              onChange={(e) => updateElement(id, { label: e.target.value })}
              className="w-full px-3 py-2 mb-2 bg-transparent border-b border-dashed focus:outline-none focus:border-blue-500"
              placeholder="Enter checkbox label"
            />
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4" disabled />
              <span className="text-gray-500">Checkbox preview</span>
            </div>
          </div>
        );

      case 'radio':
        return (
          <div className="relative p-4 border rounded-md mb-4 bg-white">
            <button 
              onClick={() => removeElement(id)} 
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <X size={16} />
            </button>
            <input
              type="text"
              value={content.label || ''}
              onChange={(e) => updateElement(id, { label: e.target.value })}
              className="w-full px-3 py-2 mb-2 bg-transparent border-b border-dashed focus:outline-none focus:border-blue-500"
              placeholder="Enter radio group label"
            />
            <div className="space-y-1">
              {content.options?.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input type="radio" name={`radio_${id}`} className="h-4 w-4" disabled />
                  <span className="text-gray-500">{option}</span>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Options (one per line):</p>
              <textarea
                value={content.options?.join('\n')}
                onChange={(e) => updateElement(id, { options: e.target.value.split('\n') })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
          </div>
        );

      case 'richtext':
        return (
          <div className="relative p-4 border rounded-md mb-4 bg-white">
            <button 
              onClick={() => removeElement(id)} 
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              <X size={16} />
            </button>
            <input
              type="text"
              value={content.label || ''}
              onChange={(e) => updateElement(id, { label: e.target.value })}
              className="w-full px-3 py-2 mb-2 bg-transparent border-b border-dashed focus:outline-none focus:border-blue-500"
              placeholder="Enter rich text field label"
            />
            <div className="border border-gray-300 rounded-md p-1 mb-1 bg-gray-100">
              <div className="flex space-x-1 border-b p-1">
                <button disabled className="p-1 text-gray-400"><Type size={16} /></button>
                <button disabled className="p-1 text-gray-400"><AlignLeft size={16} /></button>
              </div>
              <div className="p-2 h-24 bg-white">
                <p className="text-gray-400">Rich text editor preview</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Left sidebar with form element buttons */}
      <div className="col-span-1">
        <div className="bg-white p-4 rounded-md shadow-sm border">
          <h2 className="font-semibold mb-4">Add Elements</h2>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => addElement('heading')}
            >
              <Type size={16} className="mr-2" /> Heading
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => addElement('text')}
            >
              <AlignLeft size={16} className="mr-2" /> Text
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => addElement('textbox')}
            >
              <FileText size={16} className="mr-2" /> Text Field
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => addElement('dropdown')}
            >
              <List size={16} className="mr-2" /> Dropdown
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => addElement('checkbox')}
            >
              <CheckSquare size={16} className="mr-2" /> Checkbox
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => addElement('radio')}
            >
              <Radio size={16} className="mr-2" /> Radio
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => addElement('richtext')}
            >
              <FileText size={16} className="mr-2" /> Rich Text
            </Button>
          </div>
        </div>
      </div>

      {/* Right main content area */}
      <div className="col-span-3">
        <div className="bg-white p-6 rounded-md shadow-sm border mb-6">
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="w-full text-xl font-bold mb-4 border-b-2 border-dashed pb-2 focus:outline-none focus:border-blue-500"
            placeholder="Enter form name..."
          />

          {formElements.map(element => renderFormElement(element))}

          {formElements.length === 0 && (
            <div className="text-center p-8 border-2 border-dashed rounded-md">
              <p className="text-gray-500">Add form elements from the left sidebar</p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Form
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
