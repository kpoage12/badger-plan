import Preferences from "./Preferences";
import type { CsPrefs } from "../../../shared/types/preferences";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { DEFAULT_CS_PREFS } from "../../../shared/types/preferences";

function PreferencesPage() {
  const [prefs, setPrefs] = useLocalStorage<CsPrefs>(
    "badgerplan.csPrefs.v1",
    DEFAULT_CS_PREFS
  );

  return <Preferences value={prefs} onChange={setPrefs} />;
}

export default PreferencesPage;
