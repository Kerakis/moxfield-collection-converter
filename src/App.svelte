<script lang="ts">
  import { convertCSV } from './lib/moxfieldConverter';

  let csvContent = '';
  let convertedOutput = '';
  let error = '';
  let fileName = '';

  function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    fileName = file.name.replace('.csv', '');
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Populate the textarea but do not auto-convert.
        // Let the user press Convert so the button always performs the action.
        csvContent = content;
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
  }

  function handleConvert() {
    if (!csvContent.trim()) {
      error = 'Please enter CSV content';
      return;
    }
    try {
      error = '';
      const result = convertCSV(csvContent);
      console.log('Conversion result:', result);
      console.log('CSV content:', csvContent);
      convertedOutput = result;
    } catch (err) {
      console.error('Conversion error:', err);
      error = `Error converting: ${err instanceof Error ? err.message : 'Unknown error'}`;
      convertedOutput = '';
    }
  }

  function downloadResult() {
    if (!convertedOutput) return;

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(convertedOutput)}`
    );
    element.setAttribute('download', `${fileName || 'moxfield'}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
</script>

<main class="bg-white flex items-center justify-center p-4">
  <div class="w-full max-w-4xl">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
        Moxfield Collection Converter
      </h1>
      <p class="text-gray-600 text-lg pt-6">
        Convert your Moxfield CSV files to text format
      </p>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-lg shadow-md p-8 border border-gray-200">
      <!-- Upload Section -->
      <div class="mb-6">
        <input
          id="csvFile"
          type="file"
          accept=".csv"
          on:change={handleFileUpload}
          class="hidden"
        />
        <button
          on:click={() => document.getElementById('csvFile')?.click()}
          class="w-full py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded transition-colors"
        >
          Upload CSV File
        </button>
        {#if fileName}
          <p class="mt-2 text-sm text-gray-600">
            Selected: <span class="font-semibold">{fileName}.csv</span>
          </p>
        {/if}
      </div>

      <!-- Paste Section -->
      <div class="mb-6">
        <label
          for="csvPaste"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          ...or paste CSV contents below:
        </label>
        <textarea
          id="csvPaste"
          bind:value={csvContent}
          class="w-full h-32 p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none resize-none"
        ></textarea>
        <button
          type="button"
          on:click={handleConvert}
          class="mt-2 w-full py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded transition-colors"
        >
          Convert
        </button>
      </div>

      <!-- Error Message -->
      {#if error}
        <div class="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-700 text-sm">{error}</p>
        </div>
      {/if}

      <!-- Output Section -->
      {#if convertedOutput}
        <div class="mb-6">
          <label
            for="output"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Converted Output
          </label>
          <textarea
            id="output"
            value={convertedOutput}
            readonly
            class="w-full h-48 p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none resize-none font-mono text-sm bg-gray-50"
          ></textarea>
          <button
            on:click={downloadResult}
            class="w-full mt-3 py-2 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded transition-colors"
          >
            Download as .txt
          </button>
        </div>
      {/if}
    </div>

    <!-- Footer -->
    <p class="text-center text-gray-500 text-xs mt-8">Kerakis</p>
  </div>
</main>
