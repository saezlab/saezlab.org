import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Mail className="h-6 w-6" />
          <div>
            <h3 className="font-medium">Email</h3>
            <p className="text-sm text-muted-foreground">contact@saezlab.org</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Phone className="h-6 w-6" />
          <div>
            <h3 className="font-medium">Phone</h3>
            <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <MapPin className="h-6 w-6" />
          <div>
            <h3 className="font-medium">Address</h3>
            <p className="text-sm text-muted-foreground">
              123 Research Drive<br />
              Science Building, Room 456<br />
              University City, ST 12345
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="subject" className="text-sm font-medium">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {status === 'submitting' ? 'Sending...' : 'Send Message'}
        </button>
        {status === 'success' && (
          <p className="text-sm text-green-600">Message sent successfully!</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-600">Error sending message. Please try again.</p>
        )}
      </form>
    </div>
  );
} 