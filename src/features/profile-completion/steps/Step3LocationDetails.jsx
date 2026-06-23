import { Loader2, LocateFixed, MapPin, MapPinned } from 'lucide-react';
import MapLocationPicker from '../components/MapLocationPicker';
import Button from '../../../components/common/Button';

const field =
    'w-full min-h-[52px] px-4 py-3 rounded-xl border border-white/15 bg-black/40 text-white text-base outline-none placeholder:text-white/50 focus:border-brand-accent/50 focus:shadow-glow focus:bg-black/60 transition-all duration-300';

const Step3LocationDetails = ({ formData, setFormData, errors, geoLoading, onUseCurrentLocation, nextStep, prevStep }) => {
    const form = formData;
    const setForm = setFormData;
    return (
        <div className="space-y-6">
            {/* Step header */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10 border border-brand-accent/20">
                    <MapPin className="h-5 w-5 text-brand-accent" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-white">Location Details</h3>
                    <p className="text-xs text-white/50">Help responders find you quickly</p>
                </div>
            </div>

            {/* GPS button + description */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-white/70">
                    Use GPS, type an address, or tap the map to pin your location.
                </p>
                <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={onUseCurrentLocation}
                    disabled={geoLoading}
                    className="shrink-0 gap-2 border-brand-accent/30 hover:bg-brand-accent/10"
                >
                    {geoLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                        <LocateFixed className="h-4 w-4" aria-hidden />
                    )}
                    {geoLoading ? 'Detecting…' : 'Use current location'}
                </Button>
            </div>

            {/* Address */}
            <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                    <MapPinned className="h-4 w-4 text-brand-accent" aria-hidden />
                    Address
                </label>
                <textarea
                    rows={3}
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                    className={`${field} min-h-[100px] resize-y ${errors.location ? 'border-red-500/60' : ''}`}
                    placeholder="Street, area, city, postal code"
                />
                {errors.location && <p className="mt-1 text-xs text-red-400">{errors.location}</p>}
            </div>

            {/* Map picker */}
            <MapLocationPicker
                latitude={form.latitude}
                longitude={form.longitude}
                onLocationChange={(partial) => setForm((p) => ({ ...p, ...partial }))}
            />

            {/* Lat/Lng readouts */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/50">
                        Latitude
                    </label>
                    <input
                        type="text"
                        inputMode="decimal"
                        readOnly
                        value={form.latitude}
                        className={`${field} cursor-default border-white/10 bg-black/25 text-white/90 font-mono text-sm`}
                    />
                </div>
                <div>
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-white/50">
                        Longitude
                    </label>
                    <input
                        type="text"
                        inputMode="decimal"
                        readOnly
                        value={form.longitude}
                        className={`${field} cursor-default border-white/10 bg-black/25 text-white/90 font-mono text-sm`}
                    />
                </div>
            </div>
        </div>
    );
};

export default Step3LocationDetails;
