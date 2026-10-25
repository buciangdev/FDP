import React, { useState, useMemo, useRef } from 'react';
import {
  Camera, RefreshCw, Sliders, Clock,
  Shield, AlertTriangle, CheckCircle2, Eye,
  Smartphone, ArrowRight, X
} from 'lucide-react';

// ==========================================
// BATIK AIR FULL NETWORK STATIONS & GMT OFFSETS
// ==========================================
interface Station {
  code: string;
  place: string;
  gmt: number;
  country: string;
}

const STATIONS: Station[] = [
  // --- MALAYSIA ---
  { code: "KUL", place: "Kuala Lumpur (KLIA)", gmt: 8, country: "Malaysia" },
  { code: "SZB", place: "Subang (Sultan Abdul Aziz Shah)", gmt: 8, country: "Malaysia" },
  { code: "PEN", place: "Penang", gmt: 8, country: "Malaysia" },
  { code: "LGK", place: "Langkawi", gmt: 8, country: "Malaysia" },
  { code: "BKI", place: "Kota Kinabalu", gmt: 8, country: "Malaysia" },
  { code: "KCH", place: "Kuching", gmt: 8, country: "Malaysia" },
  { code: "JHB", place: "Johor Bahru", gmt: 8, country: "Malaysia" },
  { code: "KBR", place: "Kota Bharu", gmt: 8, country: "Malaysia" },
  { code: "TGG", place: "Kuala Terengganu", gmt: 8, country: "Malaysia" },
  { code: "IPH", place: "Ipoh", gmt: 8, country: "Malaysia" },
  { code: "AOR", place: "Alor Setar", gmt: 8, country: "Malaysia" },
  { code: "BTU", place: "Bintulu", gmt: 8, country: "Malaysia" },
  { code: "MYY", place: "Miri", gmt: 8, country: "Malaysia" },
  { code: "SBW", place: "Sibu", gmt: 8, country: "Malaysia" },
  { code: "TWU", place: "Tawau", gmt: 8, country: "Malaysia" },

  // --- INDONESIA ---
  { code: "CGK", place: "Jakarta (Soekarno-Hatta)", gmt: 7, country: "Indonesia" },
  { code: "DPS", place: "Bali (Denpasar)", gmt: 8, country: "Indonesia" },
  { code: "BTH", place: "Batam", gmt: 7, country: "Indonesia" },
  { code: "KNO", place: "Medan (Kualanamu)", gmt: 7, country: "Indonesia" },
  { code: "PKU", place: "Pekanbaru", gmt: 7, country: "Indonesia" },
  { code: "SUB", place: "Surabaya", gmt: 7, country: "Indonesia" },
  { code: "PDG", place: "Padang", gmt: 7, country: "Indonesia" },
  { code: "LOP", place: "Lombok", gmt: 8, country: "Indonesia" },
  { code: "UPG", place: "Makassar", gmt: 8, country: "Indonesia" },
  { code: "PLM", place: "Palembang", gmt: 7, country: "Indonesia" },

  // --- SINGAPORE ---
  { code: "SIN", place: "Singapore (Changi)", gmt: 8, country: "Singapore" },

  // --- THAILAND ---
  { code: "DMK", place: "Bangkok (Don Mueang)", gmt: 7, country: "Thailand" },
  { code: "BKK", place: "Bangkok (Suvarnabhumi)", gmt: 7, country: "Thailand" },
  { code: "HKT", place: "Phuket", gmt: 7, country: "Thailand" },
  { code: "KBV", place: "Krabi", gmt: 7, country: "Thailand" },
  { code: "HDY", place: "Hat Yai", gmt: 7, country: "Thailand" },

  // --- VIETNAM ---
  { code: "HAN", place: "Hanoi", gmt: 7, country: "Vietnam" },
  { code: "DAD", place: "Da Nang", gmt: 7, country: "Vietnam" },
  { code: "SGN", place: "Ho Chi Minh City", gmt: 7, country: "Vietnam" },

  // --- TIMOR-LESTE ---
  { code: "DIL", place: "Dili", gmt: 9, country: "East Timor" },

  // --- INDIA ---
  { code: "DEL", place: "New Delhi", gmt: 5.5, country: "India" },
  { code: "BOM", place: "Mumbai", gmt: 5.5, country: "India" },
  { code: "BLR", place: "Bengaluru (Bangalore)", gmt: 5.5, country: "India" },
  { code: "COK", place: "Kochi (Cochin)", gmt: 5.5, country: "India" },
  { code: "TRZ", place: "Tiruchirappalli", gmt: 5.5, country: "India" },
  { code: "ATQ", place: "Amritsar", gmt: 5.5, country: "India" },

  // --- BANGLADESH ---
  { code: "DAC", place: "Dhaka", gmt: 6, country: "Bangladesh" },

  // --- NEPAL ---
  { code: "KTM", place: "Kathmandu", gmt: 5.75, country: "Nepal" },

  // --- PAKISTAN ---
  { code: "KHI", place: "Karachi", gmt: 5, country: "Pakistan" },
  { code: "LHE", place: "Lahore", gmt: 5, country: "Pakistan" },

  // --- SRI LANKA ---
  { code: "CMB", place: "Colombo", gmt: 5.5, country: "Sri Lanka" },

  // --- MALDIVES ---
  { code: "MLE", place: "Malé", gmt: 5, country: "Maldives" },

  // --- UZBEKISTAN ---
  { code: "TAS", place: "Tashkent", gmt: 5, country: "Uzbekistan" },

  // --- SAUDI ARABIA ---
  { code: "JED", place: "Jeddah", gmt: 3, country: "Saudi Arabia" },

  // --- AUSTRALIA ---
  { code: "PER", place: "Perth", gmt: 8, country: "Australia" },
  { code: "MEL", place: "Melbourne", gmt: 10, country: "Australia" },
  { code: "SYD", place: "Sydney", gmt: 10, country: "Australia" },
  { code: "BNE", place: "Brisbane", gmt: 10, country: "Australia" },

  // --- JAPAN ---
  { code: "NRT", place: "Tokyo (Narita)", gmt: 9, country: "Japan" },
  { code: "KIX", place: "Osaka (Kansai)", gmt: 9, country: "Japan" },
  { code: "NGO", place: "Nagoya (Centrair)", gmt: 9, country: "Japan" },
  { code: "OKA", place: "Okinawa (Naha)", gmt: 9, country: "Japan" },

  // --- SOUTH KOREA ---
  { code: "ICN", place: "Seoul (Incheon)", gmt: 9, country: "South Korea" },

  // --- TAIWAN ---
  { code: "TPE", place: "Taipei (Taoyuan)", gmt: 8, country: "Taiwan" },

  // --- HONG KONG ---
  { code: "HKG", place: "Hong Kong", gmt: 8, country: "Hong Kong" },

  // --- CHINA ---
  { code: "CAN", place: "Guangzhou", gmt: 8, country: "China" },
  { code: "CSX", place: "Changsha", gmt: 8, country: "China" },
  { code: "TFU", place: "Chengdu (Tianfu)", gmt: 8, country: "China" },
  { code: "KMG", place: "Kunming", gmt: 8, country: "China" },
  { code: "PVG", place: "Shanghai (Pudong)", gmt: 8, country: "China" },
  { code: "CGO", place: "Zhengzhou", gmt: 8, country: "China" },
  { code: "XMN", place: "Xiamen", gmt: 8, country: "China" },
  { code: "KWE", place: "Guiyang", gmt: 8, country: "China" },
  { code: "HAK", place: "Haikou", gmt: 8, country: "China" },
  { code: "ZZJ", place: "Zhangjiajie", gmt: 8, country: "China" },
  { code: "HSN", place: "Huangshan", gmt: 8, country: "China" }
];

// ==========================================
// AUSTRALIAN DAYLIGHT SAVING TIME (AEDT) ENGINE
// Flight month is checked first for Australian sectors.
// Perth (PER) is the main exception and stays fixed at GMT+8 year-round.
// Rules: DST applies in eastern Australia from Oct through Mar, then resets after the
// first Sunday of April and starts again on the first Sunday of October.
// ==========================================

/** Stations that observe Australian Eastern Daylight Time */
const AUSTRALIAN_DST_STATIONS = ["MEL", "SYD", "BNE"];

/**
 * Checks whether Australian Eastern Daylight Time is active for a given flight date.
 * This is month-first so a flight month is evaluated before any exact daily switch logic.
 */
const isAustralianDST = (date: Date = new Date()): boolean => {
  const month = date.getMonth() + 1;

  // Month-first rule for Australian summer: Oct through Mar = DST active
  if (month >= 10 || month <= 3) {
    return true;
  }

  // Exact switch handling for the boundary months to keep the calendar precise.
  if (month === 4) {
    const year = date.getFullYear();
    const aprilFirst = new Date(year, 3, 1);
    const firstSundayAprilDay = 1 + ((7 - aprilFirst.getDay()) % 7);
    const dstEnd = new Date(year, 3, firstSundayAprilDay, 3, 0, 0);
    return date < dstEnd;
  }

  if (month === 9) {
    const year = date.getFullYear();
    const octFirst = new Date(year, 9, 1);
    const firstSundayOctDay = 1 + ((7 - octFirst.getDay()) % 7);
    const dstStart = new Date(year, 9, firstSundayOctDay, 2, 0, 0);
    return date >= dstStart;
  }

  return false;
};

/**
 * Resolves the correct GMT offset for any station based on the flight date.
 * MEL/SYD: +11 during AEDT, +10 during AEST
 * PER: fixed GMT+8 year-round as the Australian exception
 */
const getStationGMTOffset = (station: Station, flightDate: Date = new Date()): number => {
  if (station.code === "PER") return 8;
  if (AUSTRALIAN_DST_STATIONS.includes(station.code)) {
    return isAustralianDST(flightDate) ? 11 : 10;
  }
  return station.gmt;
};

// DEMO ROSTER DATA FOR FALLBACK / QUICK TEST
const DEMO_ROSTER_TEXT = `10 Thu
Reporting time : 0345
IU850 0515 CGK BTH 0655 DHC
IU937Z 0740 BTH PDG 0855
IU862 0935 PDG KNO 1050
IU833 1130 KNO PKU 1240
IU832 1320 PKU KNO 1430
Debriefing time : 1500
Rest : 18:40 (11/09/2026 12:40)

11 Fri
Reporting time : 1240
IU863 1340 KNO PDG 1500
IU936 1540 PDG BTH 1655
IU859 1745 BTH CGK 1930
Debriefing time : 2000`;

// BATIK AIR OM-A CH. 7 MATRICES
type FleetType = 'B737' | 'A330' | 'ATR72';
type RoleType = 'FC' | 'CC';
type FlightRoleMinutes = Record<RoleType, number>;
type FleetReportingMap = Record<FleetType, FlightRoleMinutes>;
type ReportingTimesMap = {
  HomeBase: {
    Domestic: FleetReportingMap;
    International: FleetReportingMap;
    Mixed: FleetReportingMap;
  };
  AwayBase: FleetReportingMap;
};
type OnboardTimesMap = {
  HomeBase: FleetReportingMap;
  AwayBase: FleetReportingMap;
};

const REPORTING_TIMES: ReportingTimesMap = {
  HomeBase: {
    Domestic: { A330: { FC: 90, CC: 90 }, B737: { FC: 75, CC: 75 }, ATR72: { FC: 45, CC: 60 } },
    International: { A330: { FC: 90, CC: 90 }, B737: { FC: 75, CC: 75 }, ATR72: { FC: 45, CC: 60 } },
    Mixed: { A330: { FC: 90, CC: 90 }, B737: { FC: 75, CC: 75 }, ATR72: { FC: 45, CC: 60 } }
  },
  AwayBase: {
    A330: { FC: 90, CC: 90 },
    B737: { FC: 60, CC: 60 },
    ATR72: { FC: 45, CC: 60 }
  }
};

const ONBOARD_TIMES: OnboardTimesMap = {
  HomeBase: { ATR72: { FC: 25, CC: 30 }, B737: { FC: 35, CC: 40 }, A330: { FC: 55, CC: 60 } },
  AwayBase: { ATR72: { FC: 30, CC: 30 }, B737: { FC: 45, CC: 45 }, A330: { FC: 60, CC: 60 } }
};

const FIG_7_5_ACCLIMATISED = [
  { start: "0600-0759", max: [13.0, 12.25, 11.5, 10.75, 10.0, 9.5, 9.0, 9.0] },
  { start: "0800-1259", max: [14.0, 13.25, 12.5, 11.75, 11.0, 10.5, 10.0, 9.5] },
  { start: "1300-1759", max: [13.0, 12.25, 11.5, 10.75, 10.0, 9.5, 9.0, 9.0] },
  { start: "1800-2159", max: [12.0, 11.25, 10.5, 9.75, 9.0, 9.0, 9.0, 9.0] },
  { start: "2200-0559", max: [11.0, 10.25, 9.5, 9.0, 9.0, 9.0, 9.0, 9.0] }
];

const FIG_7_6_UNACCLIMATISED = [
  { range: "Up to 18 or Over 30", max: [13.0, 12.25, 11.5, 10.75, 10.0, 9.25, 9.0] },
  { range: "Between 18 and 30", max: [11.5, 11.0, 10.5, 9.75, 9.0, 9.0, 9.0] }
];

const timeToMins = (t: string): number => {
  if (!t) return 0;
  const clean = t.replace(/[^0-9]/g, '');
  if (clean.length < 4) return 0;
  return parseInt(clean.substring(0, 2), 10) * 60 + parseInt(clean.substring(2, 4), 10);
};

const minsToHHMM = (m: number): string => {
  const norm = ((m % 1440) + 1440) % 1440;
  return `${Math.floor(norm / 60).toString().padStart(2, '0')}${Math.round(norm % 60).toString().padStart(2, '0')}`;
};

const formatDuration = (mins: number): string => {
  const h = Math.floor(Math.abs(mins) / 60);
  const m = Math.round(Math.abs(mins) % 60);
  return `${mins < 0 ? '-' : ''}${h}h ${m}m`;
};

// Interfaces for parsed data
interface Sector {
  flightNo: string;
  depTime: string;
  depIata: string;
  arrIata: string;
  arrTime: string;
  isDeadhead: boolean;
  dhcTag: string;
}

interface Duty {
  dateHeader: string;
  reportTime: string;
  debriefTime: string;
  sectors: Sector[];
  restDuration?: string;
  nextReportTime?: string;
  isOffDay?: boolean;
  offDayNote?: string;
}

interface ComplianceResult {
  patternType: string;
  requiredReportMinsBefore: number;
  expectedReportTime: string;
  actualReportTime: string;
  onboardMinsBefore: number;
  requiredOnboardTimestamp: string;
  actualFdpMins: number;
  maxLegalFdpMins: number;
  maxBaseFdpHours: number;
  marginMins: number;
  isLegalFdp: boolean;
  totalDutyMins: number;
  calculatedDebrief: string;
  firstSector: Sector;
  lastSector: Sector;
  ruleSource: string;
}

interface Config {
  homeBase: string;
  fleet: FleetType;
  role: RoleType;
  acclimatised: boolean;
  precedingRestRange: string;
  crewComplement: 'standard' | 'augmented_3' | 'augmented_4';
  restFacility: 'class1' | 'class23';
  ccPlusOne: boolean;
}

export default function App() {
  const [config, setConfig] = useState<Config>({
    homeBase: 'CGK',
    fleet: 'B737',
    role: 'FC',
    acclimatised: true,
    precedingRestRange: 'upTo18_over30',
    crewComplement: 'standard',
    restFacility: 'class1',
    ccPlusOne: true
  });

  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [activeTab, setActiveTab] = useState<'scan' | 'analysis' | 'edit'>('scan');
  const [rosterRawText, setRosterRawText] = useState('');
  const [selectedDutyIdx, setSelectedDutyIdx] = useState(0);

  // Vision Engine States
  const [processedCanvasUrl, setProcessedCanvasUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState('');
  const [showProcessedDebug, setShowProcessedDebug] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const normalizeOcrTime = (value: string): string => {
    const cleaned = value.replace(/[^0-9]/g, '');
    return cleaned.length >= 4 ? cleaned.slice(0, 4) : value;
  };

  // Parse text into duty structure
  const normalizeHeaderLine = (line: string): string => {
    const trimmed = line.replace(/\s+/g, ' ').trim();
    const cleaned = trimmed.replace(/^(\d{1,2}\s+[A-Za-z]{3})\s+[A-Za-z]{1,3}(?:\s+\d{1,2})?\s*$/i, '$1');
    return cleaned || trimmed;
  };

  const parseRosterText = (text: string): Duty[] => {
    const lines = text
      .replace(/\r/g, '')
      .split('\n')
      .map(line => line.replace(/\s+/g, ' ').trim())
      .filter(Boolean);

    const duties: Duty[] = [];
    let currentDuty: Duty | null = null;

    lines.forEach(line => {
      const normalizedLine = normalizeHeaderLine(line);

      if (/^(\d{1,2}\s+[A-Za-z]{3}|[A-Za-z]{3}\s+\d{1,2}|\d{2}\/\d{2}\/\d{4})/i.test(normalizedLine)) {
        if (currentDuty) duties.push(currentDuty);
        currentDuty = { dateHeader: normalizedLine, reportTime: '', debriefTime: '', sectors: [], restDuration: '', nextReportTime: '' };
        return;
      }

      if (!currentDuty) currentDuty = { dateHeader: 'Duty Day', reportTime: '', debriefTime: '', sectors: [] };

      const offDayLine = line.toLowerCase();
      if (
        /day\s*off/.test(offDayLine) ||
        /off\s*day/.test(offDayLine) ||
        /guaranteed\s*day\s*off/.test(offDayLine) ||
        /\bgdo\b/.test(offDayLine) ||
        /off\s*[-:]\s*day\s*off/.test(offDayLine) ||
        /^off$/.test(offDayLine)
      ) {
        currentDuty.isOffDay = true;
        currentDuty.offDayNote = line;
        return;
      }

      const reportMatch = line.match(/Reporting\s*time\s*[:\-]?\s*([A-Z]?\d{3,4})(?:\+\d)?/i);
      if (reportMatch) { currentDuty.reportTime = normalizeOcrTime(reportMatch[1]); return; }

      const debriefMatch = line.match(/Debriefing\s*time\s*[:\-]?\s*([A-Z]?\d{3,4})(?:\+\d)?/i);
      if (debriefMatch) { currentDuty.debriefTime = normalizeOcrTime(debriefMatch[1]); return; }

      const restMatch = line.match(/Rest\s*[:\-]?\s*(\d{1,2}:\d{2})\s*\(([^)]+)\)/i);
      if (restMatch) {
        currentDuty.restDuration = restMatch[1];
        currentDuty.nextReportTime = restMatch[2];
        return;
      }

      const locationMatch = line.match(/Location\s*[:\-]?\s*([A-Z]{3})/i);
      if (currentDuty.isOffDay && locationMatch) {
        currentDuty.offDayNote = `${currentDuty.offDayNote || 'Off day'} · ${locationMatch[1]}`;
        return;
      }

      const sectorMatch = line.match(/^([A-Z0-9]{2,8})\s+([A-Z]?\d{3,4}(?:\+\d)?)\s+([A-Z]{3})\s+([A-Z]{3})\s+([A-Z]?\d{3,4}(?:\+\d)?)(?:\s+(DHC|PAX))?/i);
      if (sectorMatch) {
        const depTime = normalizeOcrTime(sectorMatch[2]);
        const arrTime = normalizeOcrTime(sectorMatch[5]);

        currentDuty.sectors.push({
          flightNo: sectorMatch[1].toUpperCase(),
          depTime,
          depIata: sectorMatch[3].toUpperCase(),
          arrIata: sectorMatch[4].toUpperCase(),
          arrTime,
          isDeadhead: !!sectorMatch[6],
          dhcTag: sectorMatch[6] ? sectorMatch[6].toUpperCase() : ''
        });
        return;
      }

      const shortenedSectorMatch = line.match(/^([A-Z0-9]{2,8})\s+([A-Z]?\d{3,4}(?:\+\d)?)\s+([A-Z]?\d{3,4}(?:\+\d)?)/i);
      if (shortenedSectorMatch) {
        currentDuty.sectors.push({
          flightNo: shortenedSectorMatch[1].toUpperCase(),
          depTime: normalizeOcrTime(shortenedSectorMatch[2]),
          depIata: '',
          arrIata: '',
          arrTime: normalizeOcrTime(shortenedSectorMatch[3]),
          isDeadhead: false,
          dhcTag: ''
        });
        return;
      }

      const timeOnlyPairMatch = line.match(/^([A-Z]?\d{3,4}(?:\+\d)?)\s+([A-Z]?\d{3,4}(?:\+\d)?)/i);
      if (timeOnlyPairMatch && currentDuty.sectors.length > 0) {
        const last = currentDuty.sectors[currentDuty.sectors.length - 1];
        last.depTime = normalizeOcrTime(timeOnlyPairMatch[1]);
        last.arrTime = normalizeOcrTime(timeOnlyPairMatch[2]);
        return;
      }
    });

    if (currentDuty) duties.push(currentDuty);
    return duties;
  };

  const parsedDuties = useMemo(() => parseRosterText(rosterRawText), [rosterRawText]);

  // ==========================================================
  // COMPUTER VISION MAINFRAME: IMAGE PRE-PROCESSING ENGINE
  // Grayscale -> Adaptive Contrast Enhancement -> Sharpening
  // ==========================================================
  const preprocessImage = (imageFile: File): Promise<{ originalBase64: string; processedBase64: string }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current || document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Computer Vision Pipeline: Binarization & Thresholding
          for (let i = 0; i < data.length; i += 4) {
            // 1. Grayscale (Luminance weighting)
            const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            // 2. High Contrast Binarization (Otsu-style dynamic boost)
            const contrastFactor = 1.4;
            let val = (avg - 128) * contrastFactor + 128;
            val = val > 140 ? 255 : (val < 90 ? 0 : val);

            data[i] = val;     // Red
            data[i + 1] = val; // Green
            data[i + 2] = val; // Blue
          }

          ctx.putImageData(imageData, 0, 0);
          const processedUrl = canvas.toDataURL('image/jpeg', 0.9);
          setProcessedCanvasUrl(processedUrl);
          resolve({ originalBase64: e.target?.result as string, processedBase64: processedUrl });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(imageFile);
    });
  };

  const readLocalOcrFallback = async (processedBase64: string): Promise<string> => {
    setScanProgress('Fallback OCR review in progress...');

    const response = await fetch(processedBase64);
    const blob = await response.blob();
    const TesseractLib = await import('tesseract.js');

    const result = await TesseractLib.recognize(blob, 'eng', {
      logger: (message: { status?: string; progress?: number }) => {
        if (message.status === 'recognizing text') {
          const pct = Math.round((message.progress ?? 0) * 100);
          setScanProgress(`Fallback OCR review: ${pct}%`);
        }
      }
    });

    return result.data.text;
  };

  // ==========================================================
  // GEMINI VISION MULTI-MODAL SCANNING ENGINE
  // ==========================================================
  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanProgress('Initializing Computer Vision Mainframe...');

    try {
      setScanProgress('Preprocessing pixels (Grayscale & Contrast Boost)...');
      const { processedBase64 } = await preprocessImage(file);
      const cleanBase64 = processedBase64.split(',')[1];

      try {
        setScanProgress('Sending image stream to Gemini Vision AI...');
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mimeType: 'image/jpeg',
            imageBase64: cleanBase64
          })
        });

        if (!response.ok) {
          throw new Error(`Gemini request failed (${response.status})`);
        }

        const result: { text?: string } = await response.json();
        const extractedText = result.text;

        if (extractedText && extractedText.includes('Reporting time')) {
          setRosterRawText(extractedText.trim());
          setScanProgress('Scan complete!');
          setActiveTab('analysis');
          return;
        }
      } catch (err) {
        console.warn('Gemini scan failed, rolling to local OCR fallback:', err);
      }

      const fallbackText = await readLocalOcrFallback(processedBase64);
      const normalizedText = fallbackText
        .replace(/\r/g, '')
        .replace(/\s+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      if (normalizedText && (normalizedText.includes('Reporting time') || /\b[A-Z]{2,6}\s+\d{4}\b/.test(normalizedText))) {
        setRosterRawText(normalizedText);
        setScanProgress('Local OCR fallback complete!');
      } else {
        setRosterRawText('');
        setScanProgress('Roster could not be read. Paste or edit your roster below.');
      }
    } catch (err) {
      console.warn('Scan error:', err);
      setRosterRawText('');
      setScanProgress('Scan unavailable. Paste or edit your roster below.');
    } finally {
      setIsScanning(false);
      setActiveTab('analysis');
    }
  };

  // ==========================================================
  // MATHEMATICAL FDP COMPLIANCE ENGINE
  // ==========================================================
  const evaluateDutyCompliance = (duty: Duty): ComplianceResult | null => {
    if (!duty) return null;

    if (duty.isOffDay) {
      const emptySector: Sector = { flightNo: 'OFF', depTime: '', depIata: '', arrIata: '', arrTime: '', isDeadhead: false, dhcTag: '' };
      return {
        patternType: 'OFF DAY',
        requiredReportMinsBefore: 0,
        expectedReportTime: '',
        actualReportTime: '',
        onboardMinsBefore: 0,
        requiredOnboardTimestamp: '',
        actualFdpMins: 0,
        maxLegalFdpMins: 0,
        maxBaseFdpHours: 0,
        marginMins: 0,
        isLegalFdp: true,
        totalDutyMins: 0,
        calculatedDebrief: '',
        firstSector: emptySector,
        lastSector: emptySector,
        ruleSource: duty.offDayNote || 'OFF DAY'
      };
    }

    if (!duty.sectors || duty.sectors.length === 0) return null;

    const firstSector = duty.sectors[0];
    const lastSector = duty.sectors[duty.sectors.length - 1];
    const totalSectorsCount = duty.sectors.length;

    const isDepartingHome = firstSector.depIata === config.homeBase;
    const homeStationObj = STATIONS.find(s => s.code === config.homeBase);
    const homeCountry = homeStationObj ? homeStationObj.country : "Indonesia";

    let hasInternational = false;
    let hasDomestic = false;

    duty.sectors.forEach(sec => {
      const depStn = STATIONS.find(s => s.code === sec.depIata);
      const arrStn = STATIONS.find(s => s.code === sec.arrIata);
      const depCountry = depStn ? depStn.country : homeCountry;
      const arrCountry = arrStn ? arrStn.country : homeCountry;

      if (depCountry !== homeCountry || arrCountry !== homeCountry) hasInternational = true;
      else hasDomestic = true;
    });

    let patternType = 'Domestic Base';
    if (!isDepartingHome) patternType = 'Away From Base';
    else if (hasInternational && hasDomestic) patternType = 'Mixed Pattern';
    else if (hasInternational) patternType = 'International Base';

    // Fig 7-2 Reporting Time
    let requiredReportMinsBefore = 75;
    if (patternType === 'Away From Base') {
      const awayBase = REPORTING_TIMES.AwayBase;
      requiredReportMinsBefore = awayBase[config.fleet][config.role];
    } else {
      const cat = patternType === 'Mixed Pattern' ? 'Mixed' : (patternType === 'International Base' ? 'International' : 'Domestic');
      const homeBase = REPORTING_TIMES.HomeBase;
      requiredReportMinsBefore = homeBase[cat][config.fleet][config.role];
    }

    const firstDepMins = timeToMins(firstSector.depTime);
    const expectedReportMins = firstDepMins - requiredReportMinsBefore;
    const actualReportMins = timeToMins(duty.reportTime);

    // Fig 7-3 & 7-4 Onboard Time
    const onboardMinsBefore = isDepartingHome
      ? ONBOARD_TIMES.HomeBase[config.fleet][config.role]
      : ONBOARD_TIMES.AwayBase[config.fleet][config.role];

    // Actual FDP
    const lastArrMins = timeToMins(lastSector.arrTime);
    let actualFdpMins = lastArrMins - actualReportMins;
    if (actualFdpMins < 0) actualFdpMins += 1440;

    // Max FDP Calculation (Fig 7-5 & 7-6 & Augmented)
    let maxBaseFdpHours = 12.0;
    let ruleSource = 'FDP MATRIX';

    if (config.crewComplement !== 'standard') {
      if (config.crewComplement === 'augmented_3') {
        maxBaseFdpHours = config.restFacility === 'class1' ? 16.0 : 15.0;
        ruleSource = 'AUGMENTED (3 PILOTS)';
      } else if (config.crewComplement === 'augmented_4') {
        maxBaseFdpHours = config.restFacility === 'class1' ? 18.0 : 17.0;
        ruleSource = 'HEAVY (4 PILOTS)';
      }
    } else if (config.acclimatised) {
      const startH = Math.floor(actualReportMins / 60);
      let timeBandIndex = 0;
      if (startH >= 6 && startH <= 7) timeBandIndex = 0;
      else if (startH >= 8 && startH <= 12) timeBandIndex = 1;
      else if (startH >= 13 && startH <= 17) timeBandIndex = 2;
      else if (startH >= 18 && startH <= 21) timeBandIndex = 3;
      else timeBandIndex = 4;

      const sectorCol = Math.min(totalSectorsCount, 8) - 1;
      maxBaseFdpHours = FIG_7_5_ACCLIMATISED[timeBandIndex].max[sectorCol];
      ruleSource = 'FIG 7-5 MATRIX (ACCLIMATISED)';
    } else {
      const bandIndex = config.precedingRestRange === 'upTo18_over30' ? 0 : 1;
      const sectorCol = Math.min(totalSectorsCount, 7) - 1;
      maxBaseFdpHours = FIG_7_6_UNACCLIMATISED[bandIndex].max[sectorCol];
      ruleSource = 'FIG 7-6 MATRIX (UNACCLIMATISED)';
    }

    if (config.role === 'CC' && config.ccPlusOne) {
      maxBaseFdpHours += 1.0;
    }

    const maxLegalFdpMins = maxBaseFdpHours * 60;
    const marginMins = maxLegalFdpMins - actualFdpMins;
    const isLegalFdp = marginMins >= 0;

    return {
      patternType,
      requiredReportMinsBefore,
      expectedReportTime: minsToHHMM(expectedReportMins),
      actualReportTime: duty.reportTime,
      onboardMinsBefore,
      requiredOnboardTimestamp: minsToHHMM(firstDepMins - onboardMinsBefore),
      actualFdpMins,
      maxLegalFdpMins,
      maxBaseFdpHours,
      marginMins,
      isLegalFdp,
      totalDutyMins: actualFdpMins + 15,
      calculatedDebrief: minsToHHMM(lastArrMins + 15),
      firstSector,
      lastSector,
      ruleSource
    };
  };

  const currentDuty = parsedDuties[selectedDutyIdx];
  const compliance = currentDuty ? evaluateDutyCompliance(currentDuty) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* HIDDEN COMPUTER VISION CANVAS */}
      <canvas ref={canvasRef} className="hidden" />

      {/* TOP TOGGLE FOR PHONE FRAME VS FULL SCREEN */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-sm mb-3 px-2 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-bold">
          <Smartphone className="w-4 h-4 text-blue-400" /> 9:16 Mobile App Container
        </span>
        <button
          onClick={() => setIsPhoneFrame(!isPhoneFrame)}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 font-semibold transition-colors"
        >
          {isPhoneFrame ? 'Full Screen View' : 'Frame 9:16 View'}
        </button>
      </div>

      {/* 9:16 MOBILE CONTAINER SHELL */}
      <div className={`w-full bg-slate-900 overflow-hidden flex flex-col transition-all shadow-2xl border-slate-800 ${
        isPhoneFrame
          ? 'sm:max-w-[410px] sm:h-[840px] sm:rounded-[40px] sm:border-[8px] sm:border-slate-800 relative'
          : 'max-w-4xl min-h-screen sm:rounded-2xl border'
      }`}>

        {/* MOBILE STATUS BAR */}
        <div className="bg-slate-950 px-6 py-2 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/60 font-mono">
          <span>09:41</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>FDP Vision OS</span>
          </div>
        </div>

        {/* BRANDING HEADER */}
        <header className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            
            {/* BRAND LOGO: BLUE SILHOUETTE PLANE FLYING LEFT INSIDE WHITE CIRCLE */}
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <svg className="w-6 h-6 text-blue-600 transform -scale-x-100" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
            </div>

            <div>
              <h1 className="font-black text-sm text-white tracking-tight leading-tight">
                Your Personal FDP Calculator
              </h1>
              <p className="text-[10px] font-semibold text-blue-400">Batik Air OM-A Ch. 7 Vision Engine</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab(activeTab === 'edit' ? 'analysis' : 'edit')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <Sliders className="w-4 h-4 text-blue-400" />
          </button>
        </header>

        {/* MAIN SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* TAB 1: VISION SCANNER ENGINE */}
          {activeTab === 'scan' && (
            <div className="space-y-4">
              
              {/* SCANNER HERO CARD */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/60 border border-blue-500/30 rounded-2xl p-5 shadow-xl text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">Roster Photo Recognition</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Scan screenshot or snap schedule for automatic extraction & compliance check.
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <input
                    type="file"
                    ref={cameraInputRef}
                    onChange={(event) => {
                      handlePhotoCapture(event);
                      event.target.value = '';
                    }}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                  />

                  <input
                    type="file"
                    ref={galleryInputRef}
                    onChange={(event) => {
                      handlePhotoCapture(event);
                      event.target.value = '';
                    }}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={isScanning}
                      className="py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-black text-[10px] uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      {isScanning ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <Camera className="w-4 h-4 text-amber-300" />
                      )}
                      Camera
                    </button>

                    <button
                      onClick={() => galleryInputRef.current?.click()}
                      disabled={isScanning}
                      className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black text-[10px] uppercase tracking-wider border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <Eye className="w-4 h-4 text-blue-300" />
                      Gallery
                    </button>
                  </div>
                </div>
              </div>

              {/* SCANNING STATUS / PRE-PROCESSING PREVIEW */}
              {isScanning && (
                <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/40 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-blue-400 text-xs font-bold">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{scanProgress}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-2/3 animate-pulse rounded-full" />
                  </div>
                </div>
              )}

              {/* PRE-PROCESSED CANVAS COMPUTER VISION DEBUG TOGGLE */}
              {processedCanvasUrl && (
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <button
                    onClick={() => setShowProcessedDebug(!showProcessedDebug)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-slate-400"
                  >
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-blue-400" /> Computer Vision Contrast Filter
                    </span>
                    <span>{showProcessedDebug ? 'Hide' : 'View Binarized Filter'}</span>
                  </button>

                  {showProcessedDebug && (
                    <div className="mt-2 text-center space-y-2">
                      <img
                        src={processedCanvasUrl}
                        alt="Preprocessed OCR stream"
                        className="max-h-48 mx-auto rounded-lg border border-slate-800 grayscale shadow-md"
                      />
                      <p className="text-[10px] text-slate-500 font-mono">
                        Canvas Binarization Engine: Grayscale + Otsu Contrast Boost Applied
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* DIRECT MANUAL PASTE / SAMPLE BUTTON */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Your Roster</span>
                  <button
                    onClick={() => {
                      setRosterRawText(DEMO_ROSTER_TEXT);
                      setActiveTab('analysis');
                    }}
                    className="text-[11px] font-bold text-blue-400 hover:underline"
                  >
                    Load Example Roster
                  </button>
                </div>

                <textarea
                  value={rosterRawText}
                  onChange={(e) => setRosterRawText(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-xs text-blue-300 focus:outline-none focus:border-blue-500"
                  placeholder="Your roster will be displayed here after scanning, or paste it here..."
                />

                <button
                  onClick={() => setActiveTab('analysis')}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  Analyze Compliance <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: MATHEMATICAL FDP ANALYSIS */}
          {activeTab === 'analysis' && (
            <div className="space-y-4">
              
              {/* DAY SELECTOR TABS */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {parsedDuties.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDutyIdx(i)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      selectedDutyIdx === i
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {d.dateHeader}
                  </button>
                ))}
              </div>

              {!compliance ? (
                currentDuty?.isOffDay ? (
                  <div className="p-5 rounded-2xl border border-emerald-500/50 bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Day Off Detected</p>
                    <p className="mt-3 text-lg font-black text-white">{currentDuty.offDayNote || 'OFF / Day Off'}</p>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50 text-amber-400" />
                    <p className="text-xs font-bold">No sector data found.</p>
                  </div>
                )
              ) : (
                <>
                  {/* MAIN LEGALITY BANNER */}
                  <div className={`p-4 rounded-2xl border shadow-xl ${
                    compliance.isLegalFdp
                      ? 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border-emerald-500/50'
                      : 'bg-gradient-to-br from-rose-950/80 via-slate-900 to-slate-900 border-rose-500/50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {compliance.isLegalFdp ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-rose-400" />
                        )}
                        <h2 className="text-sm font-black text-white">
                          {compliance.isLegalFdp ? 'LEGAL DUTY PATTERN' : 'FDP VIOLATION'}
                        </h2>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {compliance.patternType}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px] block font-semibold">CALCULATED FDP</span>
                        <strong className="font-mono text-white text-base">{formatDuration(compliance.actualFdpMins)}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block font-semibold">MAX LEGAL ALLOWED</span>
                        <strong className="font-mono text-blue-300 text-base">{formatDuration(compliance.maxLegalFdpMins)}</strong>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Legal Margin Buffer:</span>
                      <strong className={`font-mono text-sm ${compliance.marginMins >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {compliance.marginMins >= 0 ? `+${formatDuration(compliance.marginMins)}` : formatDuration(compliance.marginMins)}
                      </strong>
                    </div>
                  </div>

                  {/* BATIK AIR RULE BREAKDOWN */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                      <Shield className="w-3.5 h-3.5 text-blue-400" /> Compliance Checks (OM-A Ch. 7)
                    </h3>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <div>
                          <span className="text-slate-400 text-[10px] block">FIG 7-2 REPORTING TIME</span>
                          <span className="font-semibold text-white">Expected: {compliance.expectedReportTime} (-{compliance.requiredReportMinsBefore}m)</span>
                        </div>
                        <span className="font-mono font-bold text-blue-300 bg-slate-950 px-2 py-1 rounded">
                          Actual: {compliance.actualReportTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <div>
                          <span className="text-slate-400 text-[10px] block">FIG 7-3/7-4 ONBOARD TIME</span>
                          <span className="font-semibold text-white">Must be onboard by {compliance.requiredOnboardTimestamp}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">-{compliance.onboardMinsBefore} mins</span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <div>
                          <span className="text-slate-400 text-[10px] block font-bold">{compliance.ruleSource}</span>
                          <span className="font-semibold text-white">Sectors: {currentDuty.sectors.length} | Base Max: {compliance.maxBaseFdpHours}h</span>
                        </div>
                        {config.role === 'CC' && config.ccPlusOne && (
                          <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                            +1h CC Rule
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SECTOR SEQUENCE */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                      <Clock className="w-3.5 h-3.5 text-blue-400" /> Sectors Breakdown ({currentDuty.sectors.length})
                    </h3>

                    <div className="space-y-2">
                      {currentDuty.sectors.map((sec, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs font-mono flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-300 text-[10px] font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-white">{sec.flightNo}</span>
                            {sec.isDeadhead && (
                              <span className="text-[9px] font-black px-1 py-0.5 bg-amber-500/20 text-amber-300 rounded">DHC</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 text-slate-300">
                            <span>{sec.depTime} <strong>{sec.depIata}</strong></span>
                            <ArrowRight className="w-3 h-3 text-slate-600" />
                            <span><strong>{sec.arrIata}</strong> {sec.arrTime}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

            </div>
          )}

          {/* TAB 3: EDIT PROFILE / CONFIG MATRIX */}
          {activeTab === 'edit' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-blue-400" /> Setup Profile & Aircraft
                </h3>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Home Operating Base:</label>
                <select
                  value={config.homeBase}
                  onChange={(e) => setConfig({ ...config, homeBase: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 font-bold text-white focus:outline-none focus:border-blue-500"
                >
                  {STATIONS.map(s => {
                    const effectiveGmt = getStationGMTOffset(s);
                    const dstLabel = AUSTRALIAN_DST_STATIONS.includes(s.code) && isAustralianDST()
                      ? ' DST' : '';
                    return (
                      <option key={s.code} value={s.code}>
                        {s.code} - {s.place} (GMT +{effectiveGmt}{dstLabel})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Fleet Aircraft Type:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['B737', 'A330', 'ATR72'] as FleetType[]).map(f => (
                    <button
                      key={f}
                      onClick={() => setConfig({ ...config, fleet: f })}
                      className={`py-2 rounded-xl font-bold transition-all border ${
                        config.fleet === f ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Crew Role Designation:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setConfig({ ...config, role: 'FC' })}
                    className={`py-2 rounded-xl font-bold transition-all border ${
                      config.role === 'FC' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Tech Crew
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, role: 'CC' })}
                    className={`py-2 rounded-xl font-bold transition-all border ${
                      config.role === 'CC' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Cabin Crew (+1h)
                  </button>
                </div>
              </div>

              {config.role === 'CC' && (
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">CC Max FDP Extension:</label>
                  <button
                    onClick={() => setConfig({ ...config, ccPlusOne: !config.ccPlusOne })}
                    className={`w-full py-2 rounded-xl font-bold transition-all border ${
                      config.ccPlusOne ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {config.ccPlusOne ? '+1 Hour FDP Rule Applied' : 'Standard FDP (No +1h)'}
                  </button>
                </div>
              )}

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Operating Crew Complement:</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => setConfig({ ...config, crewComplement: 'standard' })}
                    className={`py-2 rounded-xl font-bold transition-all border ${
                      config.crewComplement === 'standard' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Standard (2)
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, crewComplement: 'augmented_3' })}
                    className={`py-2 rounded-xl font-bold transition-all border ${
                      config.crewComplement === 'augmented_3' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Augmented (3)
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, crewComplement: 'augmented_4' })}
                    className={`py-2 rounded-xl font-bold transition-all border ${
                      config.crewComplement === 'augmented_4' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Heavy (4)
                  </button>
                </div>
              </div>

              {config.crewComplement !== 'standard' && (
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">In-flight Rest Facility:</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setConfig({ ...config, restFacility: 'class1' })}
                      className={`py-2 rounded-xl font-bold transition-all border ${
                        config.restFacility === 'class1' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      Class 1 (Bunk)
                    </button>
                    <button
                      onClick={() => setConfig({ ...config, restFacility: 'class23' })}
                      className={`py-2 rounded-xl font-bold transition-all border ${
                        config.restFacility === 'class23' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      Class 2/3 (Seat)
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Acclimatisation Status:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setConfig({ ...config, acclimatised: true })}
                    className={`py-2 rounded-xl font-bold transition-all border ${
                      config.acclimatised ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Acclimatised
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, acclimatised: false })}
                    className={`py-2 rounded-xl font-bold transition-all border ${
                      !config.acclimatised ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Not Acclimatised
                  </button>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('analysis')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-colors"
              >
                Apply & Calculate
              </button>
            </div>
          )}

        </main>

        {/* BOTTOM MOBILE APP TAB BAR */}
        <nav className="bg-slate-950 border-t border-slate-800/80 px-4 py-2 flex items-center justify-around">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              activeTab === 'scan' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span>Vision Scan</span>
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              activeTab === 'analysis' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span>FDP Logic</span>
          </button>

          <button
            onClick={() => setActiveTab('edit')}
            className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
              activeTab === 'edit' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>

      </div>
    </div>
  );
}
