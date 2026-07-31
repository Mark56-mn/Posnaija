const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/ProductsPage.tsx', 'utf8');

const handlers = `
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !newCategoryName.trim()) return;
    await db.categories.put({
      id: crypto.randomUUID(),
      admin_id: session.admin_id,
      name: newCategoryName.trim(),
      created_at: new Date().toISOString(),
      synced: false
    });
    setNewCategoryName('');
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? Products in this category will be uncategorized.')) {
      await db.categories.delete(id);
      const productsToUpdate = await db.products.where('category_id').equals(id).toArray();
      for (const p of productsToUpdate) {
        await db.products.update(p.id, { category_id: '', synced: false });
      }
    }
  };

  const handleExportCSV = async () => {
    const allProducts = await db.products.toArray();
    exportToCSV(allProducts.map(p => ({
      name: p.name,
      sku: p.sku || '',
      cost_price: p.cost_price,
      selling_price: p.selling_price,
      quantity: p.quantity,
      low_stock_alert: p.low_stock_alert,
      unit: p.unit,
      category_id: p.category_id || '',
      expiry_date: p.expiry_date || ''
    })), 'products_export.csv');
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!session || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      const data = await parseCSV(file);
      for (const row of data) {
        if (!row.name || !row.selling_price) continue;
        
        // Find existing product by SKU if available, otherwise by name
        let existing = undefined;
        if (row.sku) {
          existing = await db.products.where('sku').equals(row.sku).first();
        }
        if (!existing) {
          existing = await db.products.where('name').equals(row.name).first();
        }

        const product = {
          id: existing ? existing.id : crypto.randomUUID(),
          admin_id: session.admin_id,
          name: row.name,
          sku: row.sku || '',
          cost_price: Number(row.cost_price) || 0,
          selling_price: Number(row.selling_price) || 0,
          quantity: Number(row.quantity) || 0,
          low_stock_alert: Number(row.low_stock_alert) || 5,
          unit: row.unit || 'piece',
          category_id: row.category_id || '',
          expiry_date: row.expiry_date || undefined,
          created_at: existing ? existing.created_at : new Date().toISOString(),
          updated_at: new Date().toISOString(),
          synced: false
        };
        await db.products.put(product);
      }
      alert('Products imported successfully!');
    } catch (err) {
      console.error(err);
      alert('Error importing products. Please check the CSV format.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

`;

code = code.replace(
  "const handleSave = async (e: React.FormEvent) => {",
  handlers + "  const handleSave = async (e: React.FormEvent) => {"
);

fs.writeFileSync('src/pages/dashboard/ProductsPage.tsx', code);
