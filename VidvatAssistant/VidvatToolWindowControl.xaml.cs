using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;
using System;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

namespace VidvatAssistant
{
    public partial class VidvatToolWindowControl : UserControl
    {
        public VidvatToolWindowControl()
        {
            InitializeComponent();
            Loaded += async (_, __) => await InitializeWebViewAsync();
        }

        private async Task InitializeWebViewAsync()
        {
            try
            {
                string userDataFolder =
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                                 "VidvatAssistant", "WebView2");

                Directory.CreateDirectory(userDataFolder);

                var env = await CoreWebView2Environment.CreateAsync(userDataFolder: userDataFolder);

                await Web.EnsureCoreWebView2Async(env);

                string assemblyPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
                string uiFolder = Path.Combine(assemblyPath, "ui");
                string indexPath = Path.Combine(uiFolder, "index.html");

                System.Diagnostics.Debug.WriteLine("UI folder: " + uiFolder);
                System.Diagnostics.Debug.WriteLine("Index exists: " + File.Exists(indexPath));

                Web.CoreWebView2.SetVirtualHostNameToFolderMapping(
                    "app.vidvat",
                    uiFolder,
                    CoreWebView2HostResourceAccessKind.Allow
                );

                Web.Source = new Uri("https://app.vidvat/index.html");
            }
            catch (Exception ex)
            {
                MessageBox.Show("WebView2 failed:\n" + ex, "Vidvat");
            }
        }
    }

}
