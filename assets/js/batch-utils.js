(function (global) {
  function normalizeValue(value) {
    return String(value ?? '').trim();
  }

  function getBatchDisplayStatus(batch) {
    const state = normalizeValue(batch?.state || batch?.status);
    if (state) return state;

    const screeningStatus = normalizeValue(batch?.screening_status);
    if (screeningStatus) return screeningStatus;

    return 'Pending';
  }

  function getBatchIdentifier(batch) {
    return batch?.batch_id || batch?.barcode_id || batch?.id || 'Unknown';
  }

  function getBatchVolume(batch) {
    return Number(batch?.volume_ml || batch?.volume || 0);
  }

  function isPendingLabBatch(batch) {
    const state = normalizeValue(batch?.state || batch?.status).toLowerCase();
    const screeningStatus = normalizeValue(batch?.screening_status).toLowerCase();
    const labResult = normalizeValue(batch?.lab_result).toLowerCase();

    return (
      state === 'received' ||
      state === 'pending' ||
      state === 'pending lab' ||
      screeningStatus === 'pending lab' ||
      screeningStatus === 'pending' ||
      labResult === 'pending'
    );
  }

  function isReadyToDispenseBatch(batch) {
    const state = normalizeValue(batch?.state || batch?.status).toLowerCase();
    return ['passed lab test', 'available', 'ready to dispense', 'passed'].includes(state);
  }

  const api = {
    getBatchDisplayStatus,
    getBatchIdentifier,
    getBatchVolume,
    isPendingLabBatch,
    isReadyToDispenseBatch
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  global.LacteeBatchUtils = api;
})(typeof window !== 'undefined' ? window : globalThis);
