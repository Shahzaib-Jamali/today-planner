/**
 * Parses natural language input like:
 *   "meeting at 5pm tomorrow"
 *   "submit homework on april 10"
 *   "gym at 4pm on friday"
 *   "study group 3:30pm on the 15th"
 *   "lunch at noon"
 *   "review notes tonight"
 *
 * Returns: { title, date (YYYY-MM-DD), time (HH:MM), type ("task" | "timeblock") }
 */

export type ParsedInput = {
  title: string;
  date: string;
  time: string | null;
  type: "task" | "timeblock";
};

function todayDate(): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d;
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function parseTime(input: string): { time: string; matched: string } | null {
  // "at 5pm", "at 5:30pm", "at 17:00", "at 5 pm"
  const timeRegex = /\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm|AM|PM)\b/;
  const match = input.match(timeRegex);
  if (match) {
    let hours = parseInt(match[1]);
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const period = match[3].toLowerCase();
    if (period === "pm" && hours < 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;
    return {
      time: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
      matched: match[0],
    };
  }

  // "at 17:00" or "at 9:30" (24hr without am/pm)
  const time24Regex = /\bat\s+(\d{1,2}):(\d{2})\b/;
  const match24 = input.match(time24Regex);
  if (match24) {
    const hours = parseInt(match24[1]);
    const minutes = parseInt(match24[2]);
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return {
        time: `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
        matched: match24[0],
      };
    }
  }

  // "noon"
  if (/\bnoon\b/i.test(input)) {
    return { time: "12:00", matched: "noon" };
  }

  // "midnight"
  if (/\bmidnight\b/i.test(input)) {
    return { time: "00:00", matched: "midnight" };
  }

  return null;
}

function parseDate(input: string): { date: string; matched: string } | null {
  const today = todayDate();

  // "today"
  if (/\btoday\b/i.test(input)) {
    return { date: formatDate(today), matched: "today" };
  }

  // "tonight"
  if (/\btonight\b/i.test(input)) {
    return { date: formatDate(today), matched: "tonight" };
  }

  // "tomorrow"
  if (/\btomorrow\b/i.test(input)) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return { date: formatDate(d), matched: "tomorrow" };
  }

  // "day after tomorrow"
  if (/\bday after tomorrow\b/i.test(input)) {
    const d = new Date(today);
    d.setDate(d.getDate() + 2);
    return { date: formatDate(d), matched: "day after tomorrow" };
  }

  // Day names: "on monday", "on friday", etc.
  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayRegex = /\b(?:on\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;
  const dayMatch = input.match(dayRegex);
  if (dayMatch) {
    const targetDay = dayNames.indexOf(dayMatch[1].toLowerCase());
    const currentDay = today.getDay();
    let diff = targetDay - currentDay;
    if (diff <= 0) diff += 7; // always next occurrence
    const d = new Date(today);
    d.setDate(d.getDate() + diff);
    return { date: formatDate(d), matched: dayMatch[0] };
  }

  // "on the 15th", "on the 3rd", "on 31"
  const dateNumRegex = /\b(?:on\s+(?:the\s+)?)?(\d{1,2})(?:st|nd|rd|th)?\b/;
  // Only match if preceded by "on" to avoid matching random numbers
  const onDateRegex = /\bon\s+(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)?\b/i;
  const onDateMatch = input.match(onDateRegex);
  if (onDateMatch) {
    const dayNum = parseInt(onDateMatch[1]);
    if (dayNum >= 1 && dayNum <= 31) {
      const d = new Date(today);
      d.setDate(dayNum);
      // If that date already passed this month, go to next month
      if (d < today) {
        d.setMonth(d.getMonth() + 1);
      }
      return { date: formatDate(d), matched: onDateMatch[0] };
    }
  }

  // "on april 10", "on apr 10", "april 10th"
  const months: Record<string, number> = {
    jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
    apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
    aug: 7, august: 7, sep: 8, september: 8, oct: 9, october: 9,
    nov: 10, november: 10, dec: 11, december: 11,
  };
  const monthRegex = /\b(?:on\s+)?(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?\b/i;
  const monthMatch = input.match(monthRegex);
  if (monthMatch) {
    const monthNum = months[monthMatch[1].toLowerCase()];
    const dayNum = parseInt(monthMatch[2]);
    if (monthNum !== undefined && dayNum >= 1 && dayNum <= 31) {
      const d = new Date(today.getFullYear(), monthNum, dayNum, 12);
      if (d < today) {
        d.setFullYear(d.getFullYear() + 1);
      }
      return { date: formatDate(d), matched: monthMatch[0] };
    }
  }

  return null;
}

export function parseNaturalInput(input: string, fallbackDate: string): ParsedInput {
  const timeResult = parseTime(input);
  const dateResult = parseDate(input);

  // Build the clean title by removing matched date/time phrases
  let title = input;

  if (timeResult) {
    title = title.replace(timeResult.matched, "");
  }
  if (dateResult) {
    title = title.replace(dateResult.matched, "");
  }

  // Clean up: remove leading "at", "on", extra spaces
  title = title
    .replace(/\s+/g, " ")
    .replace(/^\s*(?:at|on)\s*/i, "")
    .replace(/\s*(?:at|on)\s*$/i, "")
    .trim();

  // Capitalize first letter
  if (title.length > 0) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  return {
    title,
    date: dateResult?.date || fallbackDate,
    time: timeResult?.time || null,
    type: timeResult ? "timeblock" : "task",
  };
}
