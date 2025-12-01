using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;
using System;
using System.IO;
using System.Reflection;
using System.Windows;
using System.Windows.Controls;

namespace VidvatAssistant
{
    public partial class VidvatToolWindowControl : UserControl
    {
        public VidvatToolWindowControl()
        {
            InitializeComponent();
            Loaded += ControlLoaded;
        }

        private async void ControlLoaded(object sender, RoutedEventArgs e)
        {
            try
            {
                await Web.EnsureCoreWebView2Async();

                string assemblyPath = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
                string uiFolder = Path.Combine(assemblyPath, "ui");
                string indexPath = Path.Combine(uiFolder, "index.html");

                System.Diagnostics.Debug.WriteLine("=== Vidvat UI Loader ===");
                System.Diagnostics.Debug.WriteLine("Assembly path: " + assemblyPath);
                System.Diagnostics.Debug.WriteLine("UI folder: " + uiFolder);
                System.Diagnostics.Debug.WriteLine("Index exists: " + File.Exists(indexPath));

                if (!File.Exists(indexPath))
                {
                    Web.Source = new Uri("data:text/html,<h1>UI not found</h1>");
                    return;
                }

                Web.CoreWebView2.SetVirtualHostNameToFolderMapping(
                    "app.vidvat",
                    uiFolder,
                    CoreWebView2HostResourceAccessKind.Allow
                );

                Web.Source = new Uri("https://app.vidvat/index.html");
            }
            catch (Exception ex)
            {
                MessageBox.Show("WebView2 initialization error:\n" + ex.ToString());
            }
        }
    }
}
