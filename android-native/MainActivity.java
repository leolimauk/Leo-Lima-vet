package br.com.leomedvet.app;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Base64;
import androidx.core.content.FileProvider;
import java.io.File;
import java.io.FileOutputStream;
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
        webView.addJavascriptInterface(new FileBridge(), "AndroidFiles");
    }

    // Ponte de arquivos: grava o PDF no cache do app e abre o menu do Android
    // (Salvar em Arquivos/Drive, abrir no leitor de PDF, enviar).
    private class FileBridge {
        @JavascriptInterface
        public void share(final String name, final String base64) {
            try {
                byte[] data = Base64.decode(base64, Base64.DEFAULT);
                File dir = new File(getCacheDir(), "docs");
                dir.mkdirs();
                String safe = (name == null || name.isEmpty()) ? "arquivo.pdf" : name.replaceAll("[^A-Za-z0-9._-]", "_");
                File f = new File(dir, safe);
                FileOutputStream out = new FileOutputStream(f);
                out.write(data);
                out.close();
                final Uri uri = FileProvider.getUriForFile(MainActivity.this, getPackageName() + ".fileprovider", f);
                runOnUiThread(() -> {
                    Intent send = new Intent(Intent.ACTION_SEND);
                    send.setType("application/pdf");
                    send.putExtra(Intent.EXTRA_STREAM, uri);
                    send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    startActivity(Intent.createChooser(send, "Salvar ou abrir o PDF"));
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
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
