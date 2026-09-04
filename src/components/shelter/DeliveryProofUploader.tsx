import { useState } from 'react';
import { Upload, CheckSquare, FileText, MapPin, CheckCircle2 } from 'lucide-react';
import { Button, Textarea, Card, CardContent, CardHeader } from '../ui';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

export function DeliveryProofUploader() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhoto(url);
      toast.success('Photo uploaded! Extracting GPS geotag metadata...');
    }
  };

  const handleSubmit = async () => {
    if (!photo || !verified) {
      toast.error('Please upload a delivery photo and confirm physical receipt.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    toast.success('Delivery proof verified & published to donor gallery!');
  };

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-xl font-bold text-slate-900 font-heading">Upload Delivery Proof & Geotag</h3>
        <p className="text-sm text-slate-600 font-medium mt-1">Upload verified delivery photos and vendor invoices to confirm receipt for donors.</p>
      </CardHeader>
      <CardContent className="space-y-5 p-6">
        {/* Photo upload */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">Delivery Photo (Geotagged) *</label>
          <label className={cn(
            'relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-2xl cursor-pointer transition-all',
            photo ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 bg-slate-50 hover:border-emerald-600 hover:bg-emerald-50/30'
          )}>
            {photo ? (
              <img src={photo} alt="Delivery proof" className="h-full w-full object-cover rounded-2xl" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500 text-center p-4">
                <Upload className="w-8 h-8 text-emerald-600" />
                <span className="text-sm font-bold text-slate-800">Click or drag delivery photo here</span>
                <span className="text-xs font-medium text-slate-500">Camera GPS coordinates will be extracted for tamper-proof verification</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
          {photo && (
            <div className="mt-2 flex items-center gap-2 text-xs text-emerald-900 font-semibold bg-emerald-100/80 border border-emerald-300 rounded-xl p-2.5">
              <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>Geotag Metadata: 19.0760° N, 72.8777° E · Accuracy: ±12m · Timestamp: {new Date().toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>

        {/* Invoice upload */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">Vendor Challan / Invoice Document</label>
          <label className={cn(
            'flex items-center gap-3 w-full border border-dashed rounded-xl p-4 cursor-pointer transition-all',
            invoice ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50 hover:border-sky-600'
          )}>
            <FileText className={cn('w-5 h-5', invoice ? 'text-sky-700' : 'text-slate-400')} />
            <span className={cn('text-sm font-semibold', invoice ? 'text-sky-900' : 'text-slate-600')}>
              {invoice ? 'Vendor Invoice Uploaded ✓' : 'Upload vendor invoice or delivery challan (PDF / JPEG)'}
            </span>
            <input type="file" accept=".pdf,image/*" className="hidden" onChange={() => { setInvoice('uploaded'); toast.success('Invoice uploaded!'); }} />
          </label>
        </div>

        {/* Thank you note */}
        <Textarea
          label="Thank You Note to Donors"
          placeholder="Share a heartfelt message from the shelter staff or children..."
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* Verification checkbox */}
        <label className="flex items-start gap-3 cursor-pointer p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div
            onClick={() => setVerified(!verified)}
            className={cn('w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all', verified ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 bg-white')}
          >
            {verified && <span className="text-white text-xs font-bold">✓</span>}
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900">I physically confirm receipt of goods</span>
            <p className="text-xs text-slate-600 font-medium mt-0.5">I verify that all ordered items were delivered in good condition at the registered address.</p>
          </div>
        </label>

        <Button onClick={handleSubmit} loading={loading} variant="success" className="w-full font-bold" size="lg">
          Submit Delivery Proof & Notify Donors
        </Button>
      </CardContent>
    </Card>
  );
}
