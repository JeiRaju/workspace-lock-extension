const passwordInput = document.getElementById("passwordInput");
const lockBtn = document.getElementById("lockBtn");
const unlockBtn = document.getElementById("unlockBtn");

lockBtn.onclick = async () => {
  const password = passwordInput.value;
  const hashed = await hash(password);
  chrome.storage.local.set({ workspacePasswordHash: hashed });
  chrome.runtime.sendMessage({ action: "saveWorkspace" });
  chrome.runtime.sendMessage({ action: "lockWorkspace" });
};

unlockBtn.onclick = async () => {
  const password = passwordInput.value;
  const hashed = await hash(password);
  const stored = await chrome.storage.local.get("workspacePasswordHash");

  if (hashed === stored.workspacePasswordHash) {
    const saved = await chrome.storage.local.get("savedWorkspace");
    for (const url of saved.savedWorkspace) {
      chrome.tabs.create({ url });
    }
  } else {
    alert("Incorrect password");
  }
};

async function hash(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
