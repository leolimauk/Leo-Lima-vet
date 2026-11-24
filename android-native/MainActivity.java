package br.com.leomedvet.app;

import android.content.Context;
import android.os.Bundle;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

// Ponte de impressão: permite que o botão "Imprimir / PDF" do app abra o
// serviço de impressão do Android (impressora ou "Salvar como PDF").
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        final WebView webView = getBridge().getWebView();
        webView.addJavascriptInterface(new PrintBridge(webView), "AndroidPrint");
    }

    private class PrintBridge {
        private final WebView webView;
        PrintBridge(WebView webView) { this.webView = webView; }

        @JavascriptInterface
        public void print(final String title) {
            runOnUiThread(() -> {
                PrintManager pm = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                String name = (title == null || title.isEmpty()) ? "Receita" : title;
                PrintDocumentAdapter adapter = webView.createPrintDocumentAdapter(name);
                pm.print(name, adapter, new PrintAttributes.Builder()
                        .setMediaSize(PrintAttributes.MediaSize.ISO_A4).build());
            });
        }
    }
}
