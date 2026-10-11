package com.oplustv.app;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.os.Build;
import android.view.Window;
import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Pantalla completa de verdad: gira a horizontal, esconde las barras del sistema y mantiene la pantalla encendida. */
@CapacitorPlugin(name = "Immersive")
public class ImmersivePlugin extends Plugin {

    /** true mientras la app está en pantalla completa (lo lee MainActivity para volver a esconder las barras). */
    static volatile boolean active = false;

    static void hideBars(Activity a) {
        Window w = a.getWindow();
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(w, w.getDecorView());
        c.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
        c.hide(WindowInsetsCompat.Type.systemBars());
    }

    static void showBars(Activity a) {
        Window w = a.getWindow();
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(w, w.getDecorView());
        c.show(WindowInsetsCompat.Type.systemBars());
    }

    private static void cutout(Window w, boolean shortEdges) {
        // Con notch/cámara en pantalla: el video usa toda la pantalla en horizontal.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams lp = w.getAttributes();
            lp.layoutInDisplayCutoutMode = shortEdges
                ? WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
                : WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_DEFAULT;
            w.setAttributes(lp);
        }
    }

    @PluginMethod
    public void enter(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            Activity a = getActivity();
            active = true;
            Window w = a.getWindow();
            a.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE);
            cutout(w, true);
            w.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            hideBars(a);
            call.resolve();
        });
    }

    @PluginMethod
    public void exit(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            Activity a = getActivity();
            active = false;
            Window w = a.getWindow();
            a.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
            w.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            cutout(w, false);
            showBars(a);
            call.resolve();
        });
    }
}
