import { U as reactExports, L as jsxRuntimeExports } from "./worker-entry-hKZhhGaI.js";
import { A as AppShell } from "./AppShell-CYz6-NtT.js";
import { b as SettingsTabs, a as ProfileSettings, P as PreferencesSettings, S as SecuritySettings, N as NotificationsSettings, D as DangerZone } from "./DangerZone-CVh-65p9.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./router-BNkFluS9.js";
import "util";
import "stream";
import "path";
import "http";
import "https";
import "url";
import "fs";
import "crypto";
import "net";
import "tls";
import "assert";
import "os";
import "events";
import "http2";
import "zlib";
import "./constants-Bl7kXxvf.js";
import "./index-LBw-IAWe.js";
import "./triangle-alert-GCFJUcPs.js";
import "./Card-wMv8w39G.js";
import "./form-schemas-DTUY_JIU.js";
import "./loader-circle-CMZ_gZVG.js";
import "./button-CdtyP9Yo.js";
import "./index-TU15xtvZ.js";
import "./InputField-Cvgola_D.js";
import "./eye-C01Vu7q5.js";
import "./laptop-C_oDjGx0.js";
import "./index-BQhF8c1W.js";
import "./alert-dialog-Cv8VvcC8.js";
import "./index-BYUMqYpj.js";
function SettingsPage() {
  const [tab, setTab] = reactExports.useState("profile");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] space-y-6 animate-in fade-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight md:text-3xl", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Manage your profile, preferences, security and notifications." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 md:grid-cols-[220px_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "md:sticky md:top-6 md:self-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsTabs, { active: tab, onChange: setTab }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "min-w-0", children: [
        tab === "profile" && /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileSettings, {}),
        tab === "preferences" && /* @__PURE__ */ jsxRuntimeExports.jsx(PreferencesSettings, {}),
        tab === "security" && /* @__PURE__ */ jsxRuntimeExports.jsx(SecuritySettings, {}),
        tab === "notifications" && /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationsSettings, {}),
        tab === "danger" && /* @__PURE__ */ jsxRuntimeExports.jsx(DangerZone, {})
      ] })
    ] })
  ] }) });
}
export {
  SettingsPage as component
};
