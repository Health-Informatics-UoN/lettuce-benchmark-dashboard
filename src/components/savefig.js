export function saveSvgAsFile(svgString, filename = 'chart.svg') {
  // Create a Blob from the SVG string
  const blob = new Blob([svgString], { type: 'image/svg+xml' });

  // Create a temporary link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(link.href);
}

