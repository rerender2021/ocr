import { getAppContext } from "ave-react";
import { KbKey, InputModifier } from "ave-ui";
import { useEffect } from "react";

export interface IHotKeyMap {
	paste?: Function;
	copy?: Function;
}

export function useHotKey(map: IHotKeyMap) {
	useEffect(() => {
		const context = getAppContext();
		const window = context.getWindow();

		const hkCopy = window.HotkeyRegister(KbKey.C, InputModifier.Control);
		const hkPaste = window.HotkeyRegister(KbKey.V, InputModifier.Control);

		window.OnWindowHotkey((sender, nId, key, n) => {
			switch (nId) {
				case hkPaste:
					map?.paste();
					break;
				case hkCopy:
					map?.copy();
					break;
			}
		});
	}, []);

	return;
}
