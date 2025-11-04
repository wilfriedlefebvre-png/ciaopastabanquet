import React, { useMemo, useState, useEffect } from "react";

const MENUS = [
  {
    id: 1,
    name: "Menu 1",
    price: 49,
    description: "Includes appetizers, salad, entrée, and dessert.",
    items: [
      "ANTIPASTO MISTO — Assorted appetizers (grilled vegetables, prosciutto, caprese, olives, cheese, eggplant, etc.)",
      "HOUSE SALAD WITH ITALIAN DRESSING",
      "ENTRÉE CHOICES: CIAO PASTA, LASAGNA, RIGATONI CHECCA",
      "TIRAMISU",
    ],
  },
  {
    id: 2,
    name: "Menu 2",
    price: 52,
    description: "Includes appetizers, salad, entrée, and dessert.",
    items: [
      "ANTIPASTO MISTO — Assorted appetizers (grilled vegetables, prosciutto, caprese, olives, cheese, eggplant, etc.)",
      "HOUSE SALAD WITH ITALIAN DRESSING",
      "ENTRÉE CHOICES: PORTOBELLO RAVIOLI, RIGATONI ALLA SALSICCIA, POLLO ALLA PARMIGIANA",
      "TIRAMISU",
    ],
  },
  {
    id: 3,
    name: "Menu 3",
    price: 56,
    description: "Includes appetizers, salad, entrée, and dessert.",
    items: [
      "ANTIPASTO MISTO — Assorted appetizers (grilled vegetables, prosciutto, caprese, olives, cheese, eggplant, etc.)",
      "HOUSE SALAD WITH ITALIAN DRESSING",
      "ENTRÉE CHOICES: SALMON PORCINI, POLLO LIMONE E CARCIOFI, CIAO PASTA",
      "TIRAMISU",
    ],
  },
  {
    id: 4,
    name: "Menu 4",
    price: 59,
    description: "Includes appetizers, salad, entrée, and dessert.",
    items: [
      "ANTIPASTO MISTO — Assorted appetizers (grilled vegetables, prosciutto, caprese, olives, cheese, eggplant, etc.)",
      "HOUSE SALAD WITH ITALIAN DRESSING",
      "ENTRÉE CHOICES: BRASATO DI MANZO, POLLO PARMIGIANA, PAPPARDELLE AI PORCINI",
      "TIRAMISU",
    ],
  },
  {
    id: 5,
    name: "Menu 5",
    price: 64,
    description: "Includes appetizers, salad, entrée, and dessert.",
    items: [
      "ANTIPASTO MISTO — Assorted appetizers (grilled vegetables, prosciutto, caprese, olives, cheese, eggplant, etc.)",
      "HOUSE SALAD WITH ITALIAN DRESSING",
      "ENTRÉE CHOICES: HALIBUT MEDITERRANEO, BRASATO DI MANZO, POLLO LIMONE E CARCIOFI",
      "TIRAMISU",
    ],
  },
];

type BeverageOption = "ALL" | "WINE_BEER" | "NON_ALC";

function classNames(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

export default function BanquetApp() {
  const [eventType, setEventType] = useState("");
  const [contactName, setContactName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [adultCount, setAdultCount] = useState(0);
  const [kidCount, setKidCount] = useState(0);
  const [menuId, setMenuId] = useState(1);
  const [champagneBetween, setChampagneBetween] = useState(false);
  const [beverages, setBeverages] = useState<BeverageOption>("NON_ALC");
  const [wineSelection, setWineSelection] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [creditCard, setCreditCard] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadFileName, setDownloadFileName] = useState("");

  const selectedMenu = useMemo(() => MENUS.find((m) => m.id === menuId)!, [menuId]);
  const priceAdult = selectedMenu.price;

  const foodSubtotal = useMemo(() => priceAdult * adultCount, [priceAdult, adultCount]);
  const tax = foodSubtotal * 0.0775;
  const gratuity = foodSubtotal * 0.2;
  const grandTotal = foodSubtotal + tax + gratuity;
  const requiresWineLine = beverages === "ALL" || beverages === "WINE_BEER";

  function validate() {
    const e: Record<string, string> = {};
    if (!eventType.trim()) e.eventType = "Enter the kind of event.";
    if (!adultCount && !kidCount) e.people = "Enter at least 1 guest.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
  }

  function handleDownloadClick() {
    const defaultName = `banquet-summary-${new Date().toISOString().slice(0,10)}`;
    setDownloadFileName(defaultName);
    setShowDownloadModal(true);
  }

  function handleDownloadConfirm() {
    if (!downloadFileName.trim()) {
      const defaultName = `banquet-summary-${new Date().toISOString().slice(0,10)}`;
      setDownloadFileName(defaultName);
    }
    
    const finalFileName = downloadFileName.trim() || `banquet-summary-${new Date().toISOString().slice(0,10)}`;
    const text = summary;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = finalFileName.endsWith(".txt") ? finalFileName : finalFileName + ".txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDownloadModal(false);
    setDownloadFileName("");
  }

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll(".fade-in-section");
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const summary = useMemo(() => {
    return `Banquet Request\nContact Name: ${contactName || "—"}\nEvent: ${eventType}\nDate: ${eventDate || "—"}\nTime: ${eventTime || "—"}\nAdults: ${adultCount}\nKids: ${kidCount}\nMenu: ${selectedMenu.name}\nSubtotal: $${foodSubtotal.toFixed(2)}\nTax (7.75%): $${tax.toFixed(2)}\nGratuity (20%): $${gratuity.toFixed(2)}\nTotal: $${grandTotal.toFixed(2)}\nDeposit: $200.00\nCredit Card: ${creditCard || "—"}\nSpecial Notes: ${specialNotes}`;
  }, [contactName, eventType, eventDate, eventTime, adultCount, kidCount, priceAdult, selectedMenu, foodSubtotal, tax, gratuity, grandTotal, creditCard, specialNotes]);

  return (
    <div 
      className="min-h-screen py-10 px-4 relative"
      style={{
        backgroundImage: 'url(/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="mx-auto max-w-5xl relative z-10">
        <header className="text-center mb-8 fade-in-section">
          <h1 className="text-3xl font-bold text-white">Ciao Pasta Banquet</h1>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl shadow p-6 space-y-6">
            <section className="fade-in-section">
              <label className="block text-sm font-medium">Kind of event</label>
              <input
                type="text"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g., Birthday, Corporate, Wedding"
              />
              {errors.eventType && <p className="text-sm text-red-600 mt-1">{errors.eventType}</p>}
            </section>

            <section className="fade-in-section">
              <label className="block text-sm font-medium">Contact Name</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter contact name"
              />
            </section>

            <section className="fade-in-section">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Date of Event</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Time of Event</label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </section>

            <section className="fade-in-section">
              <h2 className="text-xl font-semibold mb-3">Guests</h2>
              <div className="grid sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium">Adults</label>
                  <input
                    type="number"
                    min={0}
                    value={adultCount}
                    onChange={(e) => setAdultCount(parseInt(e.target.value || "0"))}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Kids</label>
                  <input
                    type="number"
                    min={0}
                    value={kidCount}
                    onChange={(e) => setKidCount(parseInt(e.target.value || "0"))}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
            </section>

            <section className="fade-in-section">
              <h2 className="text-xl font-semibold mb-3">Menu</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {MENUS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMenuId(m.id)}
                    className={classNames(
                      "w-full text-left rounded-xl border p-4 hover:shadow transition",
                      menuId === m.id ? "border-black ring-2 ring-black" : "border-gray-200"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{m.name}</span>
                      <span className="text-sm">${m.price.toFixed(2)}</span>
                    </div>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-700 space-y-1">
                      {m.items.map((it, idx) => (
                        <li key={idx}>{it}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </section>

            <section className="fade-in-section">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={champagneBetween}
                  onChange={(e) => setChampagneBetween(e.target.checked)}
                />
                <span className="text-sm">Champagne toast between entrée and dessert</span>
              </label>
            </section>

            <section className="fade-in-section space-y-3">
              <h2 className="text-xl font-semibold">Beverages</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input type="radio" name="bev" checked={beverages === "ALL"} onChange={() => setBeverages("ALL")} />
                  <span className="text-sm">All beverages included</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="radio" name="bev" checked={beverages === "WINE_BEER"} onChange={() => setBeverages("WINE_BEER")} />
                  <span className="text-sm">Only Wines & Beers</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="radio" name="bev" checked={beverages === "NON_ALC"} onChange={() => setBeverages("NON_ALC")} />
                  <span className="text-sm">Non-alcoholic beverages only</span>
                </label>
              </div>
              {requiresWineLine && (
                <div>
                  <label className="block text-sm font-medium">Wine selections</label>
                  <input
                    type="text"
                    value={wineSelection}
                    onChange={(e) => setWineSelection(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
                  />
                </div>
              )}
            </section>

            <section className="fade-in-section">
              <h2 className="text-xl font-semibold">Special Notes</h2>
              <textarea
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Add any special requests or notes here..."
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 h-24"
              />
            </section>

            <section className="fade-in-section">
              <label className="block text-sm font-medium">Credit Card for $200 Deposit</label>
              <input
                type="text"
                value={creditCard}
                onChange={(e) => setCreditCard(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter credit card number"
              />
            </section>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button type="submit" className="rounded-2xl bg-black text-white px-5 py-2 font-medium hover:opacity-90">Save</button>
              <button
                type="button"
                onClick={handleDownloadClick}
                className="rounded-2xl border border-gray-300 px-5 py-2 font-medium hover:bg-gray-50 flex items-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download Summary (.txt)
              </button>
              <button
                type="button"
                onClick={() => {
                  const subject = encodeURIComponent(`Banquet Proposal — ${eventType || "Event"}`);
                  const body = encodeURIComponent(summary); // includes Special Notes
                  window.location.href = `mailto:?subject=${subject}&body=${body}`;
                }}
                className="rounded-2xl border border-gray-300 px-5 py-2 font-medium hover:bg-gray-50"
              >
                Email Proposal
              </button>
            </div>
          </form>

          <aside className="fade-in-section bg-white rounded-2xl shadow p-6 h-fit sticky top-6">
            <h3 className="text-lg font-semibold">Summary</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span>Adults:</span><span>{adultCount} × ${priceAdult}</span></div>
              <div className="flex justify-between"><span>Kids:</span><span>{kidCount}</span></div>
              <div className="flex justify-between"><span>Subtotal:</span><span>${foodSubtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax (7.75%):</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Gratuity (20%):</span><span>${gratuity.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold border-t pt-2"><span>Total:</span><span>${grandTotal.toFixed(2)}</span></div>
              <div className="pt-2"><span className="font-medium">Special Notes:</span><br />{specialNotes || "—"}</div>
            </div>
          </aside>
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDownloadModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">Enter filename for download</h3>
            <input
              type="text"
              value={downloadFileName}
              onChange={(e) => setDownloadFileName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter filename"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleDownloadConfirm();
                } else if (e.key === "Escape") {
                  setShowDownloadModal(false);
                  setDownloadFileName("");
                }
              }}
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDownloadModal(false);
                  setDownloadFileName("");
                }}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDownloadConfirm}
                className="flex-1 rounded-xl bg-black text-white px-4 py-2 font-medium hover:opacity-90"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

