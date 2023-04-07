package com.bitpay.wallet;

import com.braze.Braze;
import com.braze.ui.inappmessage.BrazeInAppMessageManager;
import com.facebook.react.ReactActivity;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Build;
import android.app.Activity;
import android.view.View;
import android.graphics.Color;
import android.view.Window;
import android.view.WindowManager;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;
import com.zoontek.rnbootsplash.RNBootSplash;

public class MainActivity extends ReactActivity {
  String TAG = "FOOB";

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "BitPay";
  }

  @Override
    protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(null);
      ((MainApplication) getApplication()).addActivityToStack(this.getClass());
      RNBootSplash.init(R.drawable.bootsplash, MainActivity.this);
      Window win = getWindow();
      win.setFlags(
        WindowManager.LayoutParams.FLAG_SECURE,
        WindowManager.LayoutParams.FLAG_SECURE
      );
      if (Build.VERSION.SDK_INT >= 19 && Build.VERSION.SDK_INT < 21) {
        setWindowFlag(this, WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS, true);
      }
      if (Build.VERSION.SDK_INT >= 19) {
        win.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
      }
      //make fully Android Transparent Status bar
      if (Build.VERSION.SDK_INT >= 21) {
        setWindowFlag(this, WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS, false);
        win.setStatusBarColor(Color.TRANSPARENT);
      }
      BrazeInAppMessageManager.getInstance().ensureSubscribedToInAppMessageEvents(MainActivity.this);

      Context appCtx = this;

      FirebaseMessaging.getInstance().getToken().addOnCompleteListener(new OnCompleteListener<String>() {
        @Override
        public void onComplete(@NonNull Task<String> task) {
            if (!task.isSuccessful()) {
              Log.d(TAG, "Failed get device token.");
              Toast.makeText(MainActivity.this, "FAILED getToken()", Toast.LENGTH_SHORT).show();
              return;
            }

            String token = task.getResult();
            Log.d(TAG, "Success get device token: " + token);
            Braze.getInstance(appCtx).setRegisteredPushToken(token);
        }
      });
  }

    public static void setWindowFlag(Activity activity, final int bits, boolean on) {
      Window win = activity.getWindow();
      WindowManager.LayoutParams winParams = win.getAttributes();
      if (on) {
        winParams.flags |= bits;
      } else {
        winParams.flags &= ~bits;
      }
      win.setAttributes(winParams);
    }

  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
  }

  @Override
  public void onResume() {
    super.onResume();
    // Registers the BrazeInAppMessageManager for the current Activity. This Activity will now listen for
    // in-app messages from Braze.
    BrazeInAppMessageManager.getInstance().registerInAppMessageManager(MainActivity.this);
  }

  @Override
  public void onPause() {
    super.onPause();
    // Unregisters the BrazeInAppMessageManager for the current Activity.
    BrazeInAppMessageManager.getInstance().unregisterInAppMessageManager(MainActivity.this);
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
    ((MainApplication) getApplication()).removeActivityFromStack(this.getClass());
  }
}
