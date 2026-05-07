/**
 * Convert a Moxfield CSV export to the Moxfield text format.
 *
 * Input CSV columns: Count, Name, Edition, Collector Number, Foil
 * Output format per line: {Count} {Name} ({Edition}) {Collector Number} {Foil}
 */

interface CardRow {
  Count?: string;
  Name?: string;
  Edition?: string;
  'Collector Number'?: string;
  Foil?: string;
  [key: string]: string | undefined;
}

function foilMarker(foilValue: string | undefined): string {
  if (!foilValue) {
    return '';
  }
  const v = foilValue.trim().toLowerCase();
  if (v === 'etched') {
    return '*E*';
  }
  // Treat anything non-empty (e.g. 'foil') as foil
  if (v) {
    return '*F*';
  }
  return '';
}

export function convertRow(row: CardRow): string {
  const count = (row.Count || '').trim();
  const name = (row.Name || '').trim();
  const edition = (row.Edition || '').trim();
  const collector = (row['Collector Number'] || '').trim();
  const foil = foilMarker(row.Foil);

  const parts: string[] = [];

  if (count) {
    parts.push(count);
  }
  if (name) {
    parts.push(name);
  }

  const editionPart = edition ? `(${edition})` : '';
  if (editionPart) {
    parts.push(editionPart);
  }

  if (collector) {
    parts.push(collector);
  }

  if (foil) {
    parts.push(foil);
  }

  return parts.join(' ');
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        // Handle escaped quotes ("")
        current += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add the last field
  values.push(current.trim());
  return values;
}

export function parseCSV(csvContent: string): CardRow[] {
  const lines = csvContent.trim().split(/\r?\n/);
  if (lines.length === 0) {
    return [];
  }

  // Parse header
  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine);

  const rows: CardRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      continue;
    }

    // Simple CSV parsing (handles basic cases)
    const values = parseCSVLine(line);
    const row: CardRow = {};

    for (let j = 0; j < headers.length && j < values.length; j++) {
      row[headers[j]] = values[j];
    }

    rows.push(row);
  }

  return rows;
}

export function convertCSV(csvContent: string): string {
  const rows = parseCSV(csvContent);
  const outputLines: string[] = [];

  for (const row of rows) {
    const line = convertRow(row);
    if (line) {
      outputLines.push(line);
    }
  }

  return outputLines.join('\n');
}

// ---------------------------------------------------------------------------
// Text → CSV conversion
// ---------------------------------------------------------------------------

function parseFoilMarkerToCSV(marker: string | undefined): string {
  if (!marker) return '';
  const m = marker.trim().toUpperCase();
  if (m === '*E*') return 'etched';
  if (m === '*F*') return 'foil';
  return '';
}

function escapeCSVField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function parseTextLine(line: string): CardRow | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Format: {Count} {Name} ({Edition}) {CollectorNumber} [*F*|*E*]
  const match = trimmed.match(
    /^(\d+)\s+(.+?)\s+\(([^)]+)\)\s+(\S+)(?:\s+(\*[EFef]\*))?$/,
  );
  if (!match) return null;

  return {
    Count: match[1],
    Name: match[2],
    Edition: match[3],
    'Collector Number': match[4],
    Foil: parseFoilMarkerToCSV(match[5]),
  };
}

export function convertTextToCSV(textContent: string): string {
  const lines = textContent.trim().split(/\r?\n/);
  const header = 'Count,Name,Edition,Collector Number,Foil';
  const rows: string[] = [header];

  for (const line of lines) {
    const row = parseTextLine(line);
    if (row) {
      const csvLine = [
        escapeCSVField(row.Count || ''),
        escapeCSVField(row.Name || ''),
        escapeCSVField(row.Edition || ''),
        escapeCSVField(row['Collector Number'] || ''),
        escapeCSVField(row.Foil || ''),
      ].join(',');
      rows.push(csvLine);
    }
  }

  return rows.join('\n');
}
