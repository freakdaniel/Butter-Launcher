import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../ConfirmModal";
import HostServerConsoleModal from "../HostServerConsoleModal";

interface HostServerPanelProps {
  hostServerStage: "root" | "local";
  setHostServerStage: (stage: "root" | "local") => void;
  setHostServerMenuOpen: (open: boolean) => void;
  hostServerRunning: boolean;
  hostServerLogs: string[];
  pushHostLog: (line: string) => void;
  availableVersions: GameVersion[];
  selectedVersion: number;
  gameDir: string | null;
  selected: GameVersion | null;
  isSelectedBuildInstalled: () => boolean;
  showSelectedBuildNotInstalledError: () => void;
}

const HostServerPanel: React.FC<HostServerPanelProps> = ({
  hostServerStage,
  setHostServerStage,
  setHostServerMenuOpen,
  hostServerRunning,
  hostServerLogs,
  pushHostLog,
  availableVersions,
  selectedVersion,
  gameDir,
  selected,
  isSelectedBuildInstalled,
  showSelectedBuildNotInstalledError,
}) => {
  const { t } = useTranslation();

  const [hostServerWarningShownThisSession, setHostServerWarningShownThisSession] = useState(false);
  const [hostServerWarningOpen, setHostServerWarningOpen] = useState(false);
  const [hostServerAuthMode, setHostServerAuthMode] = useState<"offline" | "authenticated" | "insecure">("offline");
  const [hostServerAdvancedOpen, setHostServerAdvancedOpen] = useState(false);
  const [hostServerConsoleOpen, setHostServerConsoleOpen] = useState(false);

  const [advRamEnabled, setAdvRamEnabled] = useState(false);
  const [advRamMin, setAdvRamMin] = useState("");
  const [advRamMax, setAdvRamMax] = useState("");
  const [advNoAotEnabled, setAdvNoAotEnabled] = useState(false);
  const [advCustomJvmArgs, setAdvCustomJvmArgs] = useState("");

  const [advAssetsEnabled, setAdvAssetsEnabled] = useState(false);
  const [advAssetsPath, setAdvAssetsPath] = useState("");
  const [advUniverseEnabled, setAdvUniverseEnabled] = useState(false);
  const [advUniversePath, setAdvUniversePath] = useState("");
  const [advModsEnabled, setAdvModsEnabled] = useState(false);
  const [advModsPath, setAdvModsPath] = useState("");
  const [advEarlyPluginsEnabled, setAdvEarlyPluginsEnabled] = useState(false);
  const [advEarlyPluginsPath, setAdvEarlyPluginsPath] = useState("");

  const [folderSyncWarningOpen, setFolderSyncWarningOpen] = useState(false);
  const [pendingFolderSync, setPendingFolderSync] = useState<null | {
    kind: "universe" | "mods" | "earlyplugins";
    sourceDir: string;
  }>(null);

  const selectedVersionLabel = selected
    ? selected.build_name?.trim() || `Build ${selected.build_index}`
    : "(unknown)";

  return (
    <>
      <Box
        position="absolute"
        top="100%"
        right={0}
        mt={2}
        w="420px"
        rounded="xl"
        border="1px solid rgba(255,255,255,0.1)"
        bg="rgba(0,0,0,0.55)"
        backdropFilter="blur(8px)"
        boxShadow="2xl"
        p={3}
      >
        {hostServerStage === "root" ? (
          <>
            <Box rounded="lg" border="1px solid #2a3146" bg="rgba(31,37,56,0.7)" p={3}>
              <button
                type="button"
                onClick={() => {
                  if (!hostServerWarningShownThisSession) {
                    setHostServerWarningShownThisSession(true);
                    setHostServerWarningOpen(true);
                    return;
                  }
                  if (!isSelectedBuildInstalled()) {
                    showSelectedBuildNotInstalledError();
                    return;
                  }
                  setHostServerStage("local");
                  setHostServerMenuOpen(true);
                }}
                style={{
                  display: "block",
                  margin: "0 auto",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  border: "1px solid #2a3146",
                  color: "#d1d5db",
                  background: "transparent",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                {t("hostServerModal.localHost.button")}
              </button>
            </Box>

            <Box mt={3} position="relative" overflow="hidden" rounded="lg" border="1px solid rgba(96,165,250,0.3)" bg="rgba(31,37,56,0.7)" p={3} className="animate-softGlowStrong">
              <Box
                aria-hidden="true"
                pointerEvents="none"
                position="absolute"
                inset={0}
                className="bg-chroma-animated animate-chroma-shift animate-hue-slow"
                style={{ background: "linear-gradient(to right, rgba(59,130,246,0.18), rgba(34,211,238,0.1), rgba(59,130,246,0.18))" }}
              />
              <Box position="relative" zIndex={1}>
                <Box
                  fontSize="sm"
                  fontWeight="extrabold"
                  letterSpacing="wider"
                  textTransform="uppercase"
                  textAlign="center"
                  className="animate-chroma-shift bg-chroma-animated"
                  style={{ background: "linear-gradient(to right, #3b82f6, #22d3ee, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                >
                  {t("hostServerModal.proHosting.section")} (24/7)
                </Box>
                <button
                  type="button"
                  onClick={() => void window.config.openExternal("https://www.hycloudhosting.com/gameservers/hytale?ref=butterlauncher")}
                  style={{
                    display: "block",
                    margin: "12px auto 0",
                    padding: "8px 20px",
                    borderRadius: "8px",
                    fontWeight: 700,
                    color: "white",
                    background: "linear-gradient(to right, #3b82f6, #22d3ee)",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                    transition: "all 0.15s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(to right, #2563eb, #06b6d4)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(to right, #3b82f6, #22d3ee)"; }}
                >
                  {t("hostServerModal.proHosting.button")}
                </button>
              </Box>
            </Box>
          </>
        ) : (
          <Box rounded="lg" border="1px solid #2a3146" bg="rgba(31,37,56,0.7)" p={3}>
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={3}>
              <Box fontSize="xs" fontWeight="semibold" color="gray.200">
                {t("hostServerModal.panel.authMode.label")}
              </Box>
              <select
                value={hostServerAuthMode}
                onChange={(e) => setHostServerAuthMode(e.target.value as "offline" | "authenticated" | "insecure")}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: "rgba(20,24,36,0.8)",
                  border: "1px solid #2a3146",
                  color: "white",
                  fontSize: "0.875rem",
                  outline: "none",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value="offline">{t("hostServerModal.panel.authMode.offline")}</option>
                <option value="authenticated">{t("hostServerModal.panel.authMode.authenticated")}</option>
                <option value="insecure">{t("hostServerModal.panel.authMode.insecure")}</option>
              </select>
            </Box>

            <button
              type="button"
              onClick={() => setHostServerAdvancedOpen((v) => !v)}
              style={{
                marginTop: "12px",
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: hostServerAdvancedOpen ? "1px solid rgba(96,165,250,0.6)" : "1px solid #2a3146",
                background: hostServerAdvancedOpen ? "rgba(59,130,246,0.15)" : "#23293a",
                color: hostServerAdvancedOpen ? "#bfdbfe" : "white",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 600,
                transition: "all 0.15s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { if (!hostServerAdvancedOpen) (e.currentTarget as HTMLButtonElement).style.background = "#2f3650"; }}
              onMouseLeave={(e) => { if (!hostServerAdvancedOpen) (e.currentTarget as HTMLButtonElement).style.background = "#23293a"; }}
            >
              {t("hostServerModal.panel.advanced.toggle")}
            </button>

            {hostServerAdvancedOpen ? (
              <Box mt={3} display="flex" flexDir="column" gap={2}>
                <button
                  type="button"
                  onClick={async () => {
                    if (!isSelectedBuildInstalled()) { showSelectedBuildNotInstalledError(); return; }
                    if (!gameDir || !selected) return;
                    try { await window.ipcRenderer.invoke("host-server:open-current-folder", gameDir, selected); } catch {}
                  }}
                  title={t("hostServerModal.panel.advanced.openServerFolder") as string}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #2a3146",
                    background: "transparent",
                    color: "#d1d5db",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    transition: "background 0.15s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                >
                  {t("hostServerModal.panel.advanced.openServerFolder")}
                </button>

                {/* RAM */}
                <Box display="flex" alignItems="center" gap={2} minW={0}>
                  <input type="checkbox" style={{ width: 16, height: 16 }} checked={advRamEnabled} onChange={(e) => setAdvRamEnabled(e.target.checked)} />
                  <Box w="112px" flexShrink={0} fontSize="xs" fontWeight="semibold" color="gray.200">
                    {t("hostServerModal.panel.advanced.ram")}
                  </Box>
                  <Box flex={1} minW={0} display="flex" alignItems="center" gap={1}>
                    <input
                      value={advRamMin}
                      onChange={(e) => setAdvRamMin(String(e.target.value ?? "").replace(/[^0-9]/g, ""))}
                      inputMode="numeric"
                      placeholder={t("hostServerModal.panel.advanced.min") as string}
                      disabled={!advRamEnabled}
                      style={{
                        width: "100%", minWidth: 0, padding: "8px 12px", borderRadius: "8px",
                        background: "rgba(20,24,36,0.8)", border: "1px solid #2a3146",
                        color: "white", fontSize: "0.875rem", outline: "none",
                        opacity: advRamEnabled ? 1 : 0.6, fontFamily: "inherit",
                      }}
                    />
                    <Box fontSize="sm" fontWeight="bold" color="gray.200" opacity={advRamEnabled ? 1 : 0.6}>G</Box>
                  </Box>
                  <Box flex={1} minW={0} display="flex" alignItems="center" gap={1}>
                    <input
                      value={advRamMax}
                      onChange={(e) => setAdvRamMax(String(e.target.value ?? "").replace(/[^0-9]/g, ""))}
                      inputMode="numeric"
                      placeholder={t("hostServerModal.panel.advanced.max") as string}
                      disabled={!advRamEnabled}
                      style={{
                        width: "100%", minWidth: 0, padding: "8px 12px", borderRadius: "8px",
                        background: "rgba(20,24,36,0.8)", border: "1px solid #2a3146",
                        color: "white", fontSize: "0.875rem", outline: "none",
                        opacity: advRamEnabled ? 1 : 0.6, fontFamily: "inherit",
                      }}
                    />
                    <Box fontSize="sm" fontWeight="bold" color="gray.200" opacity={advRamEnabled ? 1 : 0.6}>G</Box>
                  </Box>
                </Box>

                {/* No AOT */}
                <Box display="flex" alignItems="center" gap={2}>
                  <input type="checkbox" style={{ width: 16, height: 16 }} checked={advNoAotEnabled} onChange={(e) => setAdvNoAotEnabled(e.target.checked)} />
                  <Box fontSize="xs" fontWeight="semibold" color="gray.200">
                    {t("hostServerModal.panel.advanced.noAot")}
                  </Box>
                </Box>

                {/* Custom JVM Args */}
                <Box display="flex" alignItems="center" gap={2} minW={0}>
                  <Box w="112px" flexShrink={0} fontSize="xs" fontWeight="semibold" color="gray.200">
                    {t("hostServerModal.panel.advanced.customJvmArgs")}
                  </Box>
                  <input
                    value={advCustomJvmArgs}
                    onChange={(e) => setAdvCustomJvmArgs(e.target.value)}
                    placeholder={t("hostServerModal.panel.advanced.customJvmArgsExample") as string}
                    style={{
                      flex: 1, minWidth: 0, padding: "8px 12px", borderRadius: "8px",
                      background: "rgba(20,24,36,0.8)", border: "1px solid #2a3146",
                      color: "white", fontSize: "0.875rem", outline: "none", fontFamily: "inherit",
                    }}
                  />
                </Box>

                {/* Custom Assets */}
                <Box display="flex" alignItems="center" gap={2}>
                  <input type="checkbox" style={{ width: 16, height: 16 }} checked={advAssetsEnabled} onChange={(e) => setAdvAssetsEnabled(e.target.checked)} />
                  <Box w="112px" fontSize="xs" fontWeight="semibold" color="gray.200">
                    {t("hostServerModal.panel.advanced.customAssets")}
                  </Box>
                  <input
                    value={advAssetsPath}
                    onChange={(e) => setAdvAssetsPath(e.target.value)}
                    disabled={!advAssetsEnabled}
                    style={{
                      flex: 1, padding: "8px 12px", borderRadius: "8px",
                      background: "rgba(20,24,36,0.8)", border: "1px solid #2a3146",
                      color: "white", fontSize: "0.875rem", outline: "none",
                      opacity: advAssetsEnabled ? 1 : 0.6, fontFamily: "inherit",
                    }}
                  />
                  <button
                    type="button"
                    disabled={!advAssetsEnabled}
                    onClick={async () => {
                      if (!advAssetsEnabled) return;
                      try {
                        const res = await window.config.pickFile({ title: "Select .zip", extensions: ["zip"] });
                        if (res?.ok && res.path) setAdvAssetsPath(res.path);
                      } catch {}
                    }}
                    style={{
                      padding: "8px 12px", borderRadius: "8px", border: "1px solid #2a3146",
                      background: "transparent", color: "#d1d5db", cursor: advAssetsEnabled ? "pointer" : "not-allowed",
                      opacity: advAssetsEnabled ? 1 : 0.6, fontSize: "0.875rem", transition: "background 0.15s", fontFamily: "inherit",
                    }}
                  >
                    {t("hostServerModal.panel.advanced.chooseFile")}
                  </button>
                </Box>

                {/* Universe */}
                <Box display="flex" alignItems="center" gap={2}>
                  <input type="checkbox" style={{ width: 16, height: 16 }} checked={advUniverseEnabled} onChange={(e) => setAdvUniverseEnabled(e.target.checked)} />
                  <Box w="112px" fontSize="xs" fontWeight="semibold" color="gray.200">
                    {t("hostServerModal.panel.advanced.universe")}
                  </Box>
                  <input
                    value={advUniversePath}
                    onChange={(e) => setAdvUniversePath(e.target.value)}
                    disabled={!advUniverseEnabled}
                    style={{
                      flex: 1, padding: "8px 12px", borderRadius: "8px",
                      background: "rgba(20,24,36,0.8)", border: "1px solid #2a3146",
                      color: "white", fontSize: "0.875rem", outline: "none",
                      opacity: advUniverseEnabled ? 1 : 0.6, fontFamily: "inherit",
                    }}
                  />
                  <button
                    type="button"
                    disabled={!advUniverseEnabled}
                    onClick={async () => {
                      if (!advUniverseEnabled) return;
                      try {
                        const res = await window.config.pickFolder({ title: "Select folder" });
                        if (res?.ok && res.path) {
                          setAdvUniversePath(res.path);
                          setPendingFolderSync({ kind: "universe", sourceDir: res.path });
                          setFolderSyncWarningOpen(true);
                        }
                      } catch {}
                    }}
                    style={{
                      padding: "8px 12px", borderRadius: "8px", border: "1px solid #2a3146",
                      background: "transparent", color: "#d1d5db", cursor: advUniverseEnabled ? "pointer" : "not-allowed",
                      opacity: advUniverseEnabled ? 1 : 0.6, fontSize: "0.875rem", transition: "background 0.15s", fontFamily: "inherit",
                    }}
                  >
                    {t("hostServerModal.panel.advanced.chooseFolder")}
                  </button>
                </Box>

                {/* Mods */}
                <Box display="flex" alignItems="center" gap={2}>
                  <input type="checkbox" style={{ width: 16, height: 16 }} checked={advModsEnabled} onChange={(e) => setAdvModsEnabled(e.target.checked)} />
                  <Box w="112px" fontSize="xs" fontWeight="semibold" color="gray.200">
                    {t("hostServerModal.panel.advanced.mods")}
                  </Box>
                  <input
                    value={advModsPath}
                    onChange={(e) => setAdvModsPath(e.target.value)}
                    disabled={!advModsEnabled}
                    style={{
                      flex: 1, padding: "8px 12px", borderRadius: "8px",
                      background: "rgba(20,24,36,0.8)", border: "1px solid #2a3146",
                      color: "white", fontSize: "0.875rem", outline: "none",
                      opacity: advModsEnabled ? 1 : 0.6, fontFamily: "inherit",
                    }}
                  />
                  <button
                    type="button"
                    disabled={!advModsEnabled}
                    onClick={async () => {
                      if (!advModsEnabled) return;
                      try {
                        const res = await window.config.pickFolder({ title: "Select folder" });
                        if (res?.ok && res.path) {
                          setAdvModsPath(res.path);
                          setPendingFolderSync({ kind: "mods", sourceDir: res.path });
                          setFolderSyncWarningOpen(true);
                        }
                      } catch {}
                    }}
                    style={{
                      padding: "8px 12px", borderRadius: "8px", border: "1px solid #2a3146",
                      background: "transparent", color: "#d1d5db", cursor: advModsEnabled ? "pointer" : "not-allowed",
                      opacity: advModsEnabled ? 1 : 0.6, fontSize: "0.875rem", transition: "background 0.15s", fontFamily: "inherit",
                    }}
                  >
                    {t("hostServerModal.panel.advanced.chooseFolder")}
                  </button>
                </Box>

                {/* Early Plugins */}
                <Box display="flex" alignItems="center" gap={2}>
                  <input type="checkbox" style={{ width: 16, height: 16 }} checked={advEarlyPluginsEnabled} onChange={(e) => setAdvEarlyPluginsEnabled(e.target.checked)} />
                  <Box w="112px" fontSize="xs" fontWeight="semibold" color="gray.200">
                    {t("hostServerModal.panel.advanced.earlyPlugins")}
                  </Box>
                  <input
                    value={advEarlyPluginsPath}
                    onChange={(e) => setAdvEarlyPluginsPath(e.target.value)}
                    disabled={!advEarlyPluginsEnabled}
                    style={{
                      flex: 1, padding: "8px 12px", borderRadius: "8px",
                      background: "rgba(20,24,36,0.8)", border: "1px solid #2a3146",
                      color: "white", fontSize: "0.875rem", outline: "none",
                      opacity: advEarlyPluginsEnabled ? 1 : 0.6, fontFamily: "inherit",
                    }}
                  />
                  <button
                    type="button"
                    disabled={!advEarlyPluginsEnabled}
                    onClick={async () => {
                      if (!advEarlyPluginsEnabled) return;
                      try {
                        const res = await window.config.pickFolder({ title: "Select folder" });
                        if (res?.ok && res.path) {
                          setAdvEarlyPluginsPath(res.path);
                          setPendingFolderSync({ kind: "earlyplugins", sourceDir: res.path });
                          setFolderSyncWarningOpen(true);
                        }
                      } catch {}
                    }}
                    style={{
                      padding: "8px 12px", borderRadius: "8px", border: "1px solid #2a3146",
                      background: "transparent", color: "#d1d5db", cursor: advEarlyPluginsEnabled ? "pointer" : "not-allowed",
                      opacity: advEarlyPluginsEnabled ? 1 : 0.6, fontSize: "0.875rem", transition: "background 0.15s", fontFamily: "inherit",
                    }}
                  >
                    {t("hostServerModal.panel.advanced.chooseFolder")}
                  </button>
                </Box>
              </Box>
            ) : null}

            <Box mt={3} display="flex" alignItems="center" justifyContent="space-between" gap={2}>
              <button
                type="button"
                onClick={() => setHostServerConsoleOpen(true)}
                style={{
                  padding: "8px 12px", borderRadius: "8px", border: "1px solid #2a3146",
                  background: "transparent", color: "#d1d5db", cursor: "pointer",
                  fontSize: "0.875rem", fontWeight: 600, transition: "background 0.15s", fontFamily: "inherit",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                {t("hostServerModal.panel.actions.showConsole")}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!hostServerRunning) {
                    if (!isSelectedBuildInstalled()) { showSelectedBuildNotInstalledError(); return; }
                    const version = availableVersions?.[selectedVersion] ?? null;
                    if (!version || !gameDir) { alert(t("hostServerModal.errors.serverStartFailed")); return; }

                    const assetsZipPath = (() => {
                      if (!advAssetsEnabled) return null;
                      const p = advAssetsPath.trim();
                      if (!p) { alert(t("hostServerModal.errors.customAssetsMissing")); return null; }
                      return p;
                    })();
                    if (advAssetsEnabled && !assetsZipPath) return;

                    let ramMinGb: number | null = null;
                    let ramMaxGb: number | null = null;
                    if (advRamEnabled) {
                      const min = Number.parseInt(advRamMin, 10);
                      const max = Number.parseInt(advRamMax, 10);
                      if (!Number.isFinite(min) || !Number.isFinite(max)) { alert(t("hostServerModal.errors.ramMissing")); return; }
                      if (min <= 0 || max <= 0) { alert(t("hostServerModal.errors.ramInvalid")); return; }
                      if (max < min) { alert(t("hostServerModal.errors.ramRange")); return; }
                      ramMinGb = min; ramMaxGb = max;
                    }

                    pushHostLog(`[Launcher] Starting server...`);
                    void window.config
                      .hostServerStart(gameDir, version, {
                        assetsZipPath, authMode: hostServerAuthMode, noAot: advNoAotEnabled,
                        ramMinGb, ramMaxGb, customJvmArgs: advCustomJvmArgs.trim() || null,
                      })
                      .then((res) => {
                        if (res?.ok) return;
                        const code = res?.error?.code;
                        if (code === "JAVA_NOT_FOUND" || code === "JAVA_TOO_OLD" || code === "JAVA_CHECK_FAILED") {
                          if (code === "JAVA_TOO_OLD") {
                            const found = (res as any)?.error?.details?.major ?? (res as any)?.error?.details?.found ?? "?";
                            alert(t("hostServerModal.errors.javaTooOld", { found }));
                          } else {
                            alert(t("hostServerModal.errors.java25Required"));
                          }
                          const raw = (res as any)?.error?.details?.raw;
                          const execPath = (res as any)?.error?.details?.execPath;
                          if (typeof execPath === "string" && execPath.trim()) pushHostLog(`[Launcher] Java exec: ${execPath}`);
                          if (typeof raw === "string" && raw.trim()) pushHostLog(`[Launcher] java -version: ${raw}`);
                          return;
                        }
                        if (code === "ASSETS_ZIP_MISSING") {
                          const p = (res as any)?.error?.details?.assetsPath;
                          alert(t("hostServerModal.errors.assetsZipMissing", { path: typeof p === "string" ? p : "" }));
                          return;
                        }
                        alert(t("hostServerModal.errors.serverStartFailed"));
                        const msg = res?.error?.message;
                        if (typeof msg === "string" && msg.trim()) pushHostLog(`[Launcher] Start failed: ${msg}`);
                      })
                      .catch(() => alert(t("hostServerModal.errors.serverStartFailed")));
                  } else {
                    void window.config.hostServerStop().then((r) => {
                      if (!r?.ok) { alert(t("hostServerModal.errors.serverStopFailed")); return; }
                      pushHostLog(`[Launcher] Stopping server...`);
                    });
                  }
                }}
                style={{
                  padding: "8px 16px", borderRadius: "8px",
                  color: "white", fontWeight: 800, transition: "all 0.15s",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: hostServerRunning ? "#dc2626" : "#16a34a",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = hostServerRunning ? "#b91c1c" : "#15803d"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = hostServerRunning ? "#dc2626" : "#16a34a"; }}
              >
                {hostServerRunning
                  ? t("hostServerModal.panel.actions.stopServer")
                  : t("hostServerModal.panel.actions.startServer")}
              </button>
            </Box>
          </Box>
        )}
      </Box>

      <ConfirmModal
        open={hostServerWarningOpen}
        title={t("hostServerModal.warning.title")}
        message={`${t("hostServerModal.localHost.note")}\n\n${t("hostServerModal.warning.versionLine", { version: selectedVersionLabel })}`}
        cancelText={t("hostServerModal.warning.dedicated")}
        confirmText={t("hostServerModal.warning.confirm")}
        onCancel={() => {
          setHostServerWarningOpen(false);
          void window.config.openExternal("https://www.hycloudhosting.com/gameservers/hytale?ref=butterlauncher");
        }}
        onConfirm={() => {
          setHostServerWarningOpen(false);
          if (!isSelectedBuildInstalled()) { showSelectedBuildNotInstalledError(); return; }
          setHostServerStage("local");
          setHostServerMenuOpen(true);
        }}
      />

      <ConfirmModal
        open={folderSyncWarningOpen}
        title={t("hostServerModal.warning.folderSyncTitle")}
        message={t("hostServerModal.warning.folderSyncMessage", { target: pendingFolderSync?.kind ?? "" })}
        cancelText={t("common.cancel")}
        confirmText={t("common.confirm")}
        onCancel={() => { setFolderSyncWarningOpen(false); setPendingFolderSync(null); }}
        onConfirm={() => {
          setFolderSyncWarningOpen(false);
          const pending = pendingFolderSync;
          setPendingFolderSync(null);
          if (!pending) return;
          if (hostServerRunning) { alert(t("hostServerModal.errors.folderSyncRunning")); return; }
          if (!isSelectedBuildInstalled()) { showSelectedBuildNotInstalledError(); return; }
          const version = availableVersions?.[selectedVersion] ?? null;
          if (!version || !gameDir) { alert(t("hostServerModal.errors.folderSyncFailed")); return; }
          void window.config
            .hostServerSyncFolder(gameDir, version, pending.kind, pending.sourceDir)
            .then((r) => {
              if (r?.ok) { pushHostLog(`[Launcher] Synced ${pending.kind} into Server/${pending.kind}`); return; }
              const code = (r as any)?.error?.code;
              if (code === "RUNNING") { alert(t("hostServerModal.errors.folderSyncRunning")); return; }
              if (code === "SOURCE_MISSING") {
                const p = (r as any)?.error?.details?.sourceDir ?? "";
                alert(t("hostServerModal.errors.folderSourceMissing", { path: String(p) }));
                return;
              }
              alert(t("hostServerModal.errors.folderSyncFailed"));
              const msg = (r as any)?.error?.message;
              if (typeof msg === "string" && msg.trim()) pushHostLog(`[Launcher] Folder sync failed: ${msg}`);
            })
            .catch(() => alert(t("hostServerModal.errors.folderSyncFailed")));
        }}
      />

      <HostServerConsoleModal
        open={hostServerConsoleOpen}
        onClose={() => setHostServerConsoleOpen(false)}
        logs={hostServerLogs}
        onCommand={(cmd) => {
          void window.config.hostServerCommand(cmd).then((r) => {
            if (r?.ok) return;
            if (r?.error?.code === "NOT_RUNNING") { alert(t("hostServerModal.errors.serverNotRunning")); return; }
            alert(t("hostServerModal.errors.commandFailed"));
          });
        }}
      />
    </>
  );
};

export default HostServerPanel;
