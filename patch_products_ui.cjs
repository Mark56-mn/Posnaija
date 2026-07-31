const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/ProductsPage.tsx', 'utf8');

// Replace Add Product button block with more buttons
const buttonBlock = `        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleImportCSV} />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} title="Import CSV">
            <Upload className="h-4 w-4 mr-2" /> Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} title="Export CSV">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowCategoriesModal(true)}>
            <List className="h-4 w-4 mr-2" /> Categories
          </Button>
          <Button variant="outline" size="sm" onClick={handleAuditLogsClick}>
            <History className="h-4 w-4 mr-2" /> Audit
          </Button>
          <Button size="sm" onClick={handleAddProductClick}>
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </div>`;
        
code = code.replace(
  /<div className="flex gap-2 w-full sm:w-auto">[\s\S]*?<\/div>/m,
  buttonBlock
);

// Add category_id to the Add Product form
const categorySelectHtml = `
                <div>
                  <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">Category</label>
                  <select className="flex h-10 w-full rounded-md border border-[var(--color-muted)]/30 bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]" value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                    <option value="">No Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
`;

code = code.replace(
  /<div>\s*<label className="text-sm font-medium text-\[var\(--color-muted\)\] mb-1 block">SKU \/ Barcode<\/label>\s*<Input value=\{formData.sku\}(.*?) \/>\s*<\/div>/g,
  `<div>
                  <label className="text-sm font-medium text-[var(--color-muted)] mb-1 block">SKU / Barcode</label>
                  <Input value={formData.sku} $1 />
                </div>` + categorySelectHtml
);

// Add Categories Modal JSX right before Adjust Stock Modal
const categoriesModal = `
      {/* Categories Modal */}
      {showCategoriesModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[90vh] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--color-muted)]/10 pb-4">
              <CardTitle>Manage Categories</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCategoriesModal(false)}>Close</Button>
            </CardHeader>
            <div className="p-4 border-b border-[var(--color-muted)]/10">
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <Input required placeholder="New category name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                <Button type="submit">Add</Button>
              </form>
            </div>
            <CardContent className="flex-1 overflow-auto p-0">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-[var(--color-muted)]/10">
                  {categories.map(c => (
                    <tr key={c.id} className="hover:bg-[var(--color-background)]/50">
                      <td className="p-4 font-medium">{c.name}</td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" className="text-[var(--color-danger)]" onClick={() => handleDeleteCategory(c.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={2} className="p-8 text-center text-[var(--color-muted)]">No categories found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}
`;

code = code.replace(
  "{/* Adjust Stock Modal */}",
  categoriesModal + "      {/* Adjust Stock Modal */}"
);

fs.writeFileSync('src/pages/dashboard/ProductsPage.tsx', code);
