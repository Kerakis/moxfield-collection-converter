<script lang="ts">
  import { convertCSV, convertTextToCSV } from './lib/moxfieldConverter';

  type Mode = 'csv-to-text' | 'text-to-csv';

  let mode: Mode = 'csv-to-text';
  let inputContent = '';
  let convertedOutput = '';
  let error = '';
  let fileName = '';

  function setMode(newMode: Mode) {
    mode = newMode;
    inputContent = '';
    convertedOutput = '';
    error = '';
    fileName = '';
  }

  function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const ext = mode === 'csv-to-text' ? '.csv' : '.txt';
    fileName = file.name.replace(ext, '');
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        inputContent = content;
        error = '';
        convertedOutput = '';
      } catch (err) {
        error = `Error reading file: ${err instanceof Error ? err.message : 'Unknown error'}`;
        convertedOutput = '';
      }
    };

    reader.onerror = () => {
      error = 'Error reading file';
      convertedOutput = '';
    };

    reader.readAsText(file);
    // Reset input so the same file can be re-selected after a mode switch
    input.value = '';
  }

  function handleConvert() {
    if (!inputContent.trim()) {
      error =
        mode === 'csv-to-text'
          ? 'Please enter CSV content'
          : 'Please enter text content';
      return;
    }
    try {
      error = '';
      convertedOutput =
        mode === 'csv-to-text'
          ? convertCSV(inputContent)
          : convertTextToCSV(inputContent);
    } catch (err) {
      console.error('Conversion error:', err);
      error = `Error converting: ${err instanceof Error ? err.message : 'Unknown error'}`;
      convertedOutput = '';
    }
  }

  function downloadResult() {
    if (!convertedOutput) return;

    const ext = mode === 'csv-to-text' ? '.txt' : '.csv';
    const mimeType = mode === 'csv-to-text' ? 'text/plain' : 'text/csv';
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:${mimeType};charset=utf-8,${encodeURIComponent(convertedOutput)}`,
    );
    element.setAttribute('download', `${fileName || 'moxfield'}${ext}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
</script>

<main
  class="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-4 py-14"
>
  <div class="w-full max-w-xl">
    <!-- Header -->
    <div class="mb-10">
      <h1 class="text-2xl font-semibold tracking-tight text-slate-100">
        Moxfield Collection Converter
      </h1>
      <p class="mt-1.5 text-sm text-slate-500">
        {mode === 'csv-to-text'
          ? 'Moxfield CSV export → plain text list'
          : 'Plain text list → Moxfield CSV import'}
      </p>
    </div>

    <!-- Mode Toggle -->
    <div
      class="inline-flex bg-slate-900 border border-slate-800 rounded-lg p-1 gap-1 mb-8"
    >
      <button
        on:click={() => setMode('csv-to-text')}
        class="px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer {mode ===
        'csv-to-text'
          ? 'bg-amber-400 text-slate-900'
          : 'text-slate-400 hover:text-slate-200'}">CSV → Text</button
      >
      <button
        on:click={() => setMode('text-to-csv')}
        class="px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer {mode ===
        'text-to-csv'
          ? 'bg-amber-400 text-slate-900'
          : 'text-slate-400 hover:text-slate-200'}">Text → CSV</button
      >
    </div>

    <!-- Upload Drop Zone -->
    <div class="mb-4">
      <input
        id="fileInput"
        type="file"
        accept={mode === 'csv-to-text' ? '.csv' : '.txt'}
        on:change={handleFileUpload}
        class="hidden"
      />
      <button
        on:click={() => document.getElementById('fileInput')?.click()}
        class="w-full border-2 border-dashed border-slate-800 hover:border-amber-400 rounded-xl py-7 flex flex-col items-center gap-2 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="size-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
          />
        </svg>
        {#if fileName}
          <span class="text-sm"
            >{fileName}{mode === 'csv-to-text' ? '.csv' : '.txt'}</span
          >
        {:else}
          <span class="text-sm"
            >Click to upload {mode === 'csv-to-text' ? '.csv' : '.txt'}</span
          >
        {/if}
      </button>
    </div>

    <!-- Or Divider -->
    <div class="flex items-center gap-3 mb-4">
      <div class="flex-1 h-px bg-slate-800"></div>
      <span class="text-xs text-slate-700 uppercase tracking-widest"
        >or paste</span
      >
      <div class="flex-1 h-px bg-slate-800"></div>
    </div>

    <!-- Paste Area -->
    <textarea
      id="inputPaste"
      bind:value={inputContent}
      placeholder={mode === 'csv-to-text'
        ? 'Count,Name,Edition,Collector Number,Foil\n1,Sol Ring,2ED,402,'
        : '1 Sol Ring (2ED) 402'}
      class="w-full h-36 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-700 font-mono text-sm focus:border-amber-400 focus:outline-none resize-none"
    ></textarea>

    <!-- Convert Button -->
    <button
      type="button"
      on:click={handleConvert}
      class="mt-3 w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold rounded-lg transition-colors cursor-pointer text-sm"
    >
      Convert
    </button>

    <!-- Error -->
    {#if error}
      <div class="mt-4 px-4 py-3 bg-red-950 border border-red-900 rounded-lg">
        <p class="text-red-400 text-sm">{error}</p>
      </div>
    {/if}

    <!-- Output -->
    {#if convertedOutput}
      <div class="mt-6">
        <div class="flex items-center justify-between mb-2">
          <span
            class="text-xs font-medium text-slate-500 uppercase tracking-widest"
            >Output</span
          >
          <span class="text-xs text-slate-700"
            >{convertedOutput.split('\n').length} lines</span
          >
        </div>
        <textarea
          id="output"
          value={convertedOutput}
          readonly
          class="w-full h-52 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-300 font-mono text-sm focus:outline-none resize-none"
        ></textarea>
        <button
          on:click={downloadResult}
          class="w-full mt-3 py-2.5 border border-slate-700 hover:border-amber-400 text-slate-400 hover:text-amber-400 font-medium rounded-lg transition-colors cursor-pointer text-sm"
        >
          Download {mode === 'csv-to-text' ? '.txt' : '.csv'}
        </button>
      </div>
    {/if}

    <!-- Footer -->
    <p class="text-center text-slate-800 text-xs mt-12">Kerakis</p>
  </div>
</main>
