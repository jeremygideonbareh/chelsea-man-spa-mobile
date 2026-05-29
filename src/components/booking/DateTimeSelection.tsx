import { useState, useMemo } from 'react';

interface DateTimeSelectionProps {
  onSelect: (isoTime: string) => void;
}

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
];

function getNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }
  return days;
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DateTimeSelection({ onSelect }: DateTimeSelectionProps) {
  const dates = useMemo(() => getNext7Days(), []);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedTime === null) return;
    const date = dates[selectedDateIndex];
    const [hours, minutes] = selectedTime.split(':');
    const isoDate = new Date(date);
    isoDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    onSelect(isoDate.toISOString());
  };

  const isSlotDisabled = (index: number) => {
    return (index * 7 + selectedDateIndex * 3) % 7 === 0;
  };

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .slot-item {
          opacity: 0;
          animation: fadeInScale 0.3s ease both;
        }
      `}</style>

      {/* Date Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-900 text-sm font-semibold">Select Date</h3>
          <span className="text-slate-400 text-xs">
            {monthNames[dates[selectedDateIndex].getMonth()]} {dates[selectedDateIndex].getFullYear()}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {dates.map((date, index) => {
            const isSelected = selectedDateIndex === index;
            const isToday = index === 0;
            return (
              <button
                key={index}
                className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl flex-shrink-0 transition-all slot-item ${
                  isSelected
                    ? 'bg-amber-500 text-white'
                    : 'bg-white border border-slate-200 text-slate-700'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => setSelectedDateIndex(index)}
              >
                <span className={`text-[9px] font-medium ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                  {isToday ? 'Today' : dayNames[date.getDay()]}
                </span>
                <span className="text-lg font-bold mt-0.5">{date.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <h3 className="text-slate-900 text-sm font-semibold mb-3">Select Time</h3>
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((time, index) => {
            const isSelected = selectedTime === time;
            const isDisabled = isSlotDisabled(index);
            return (
              <button
                key={time}
                className={`py-2.5 rounded-xl text-xs font-medium transition-all slot-item ${
                  isSelected
                    ? 'bg-amber-500 text-white shadow-sm'
                    : isDisabled
                    ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                }`}
                style={{ animationDelay: `${index * 0.02}s` }}
                onClick={() => !isDisabled && setSelectedTime(time)}
                disabled={isDisabled}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div
        className="transition-all"
        style={{
          opacity: selectedTime ? 1 : 0.3,
          transform: selectedTime ? 'translateY(0)' : 'translateY(8px)',
        }}
      >
        <button
          className="amber-btn w-full h-14 rounded-2xl text-sm font-semibold disabled:opacity-50"
          onClick={handleContinue}
          disabled={!selectedTime}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
