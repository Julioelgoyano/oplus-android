package com.oplustv.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(ImmersivePlugin.class);
        super.onCreate(savedInstanceState);
    }

    /** Si estás en pantalla completa y Android vuelve a mostrar las barras (al regresar de otra app, un aviso, etc.), se esconden otra vez. */
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus && ImmersivePlugin.active) {
            ImmersivePlugin.hideBars(this);
        }
    }
}
