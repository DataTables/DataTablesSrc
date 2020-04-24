describe("core - ajax.reload()", function() {
  dt.libs({
    js: ["jquery", "datatables"],
    css: ["datatables"]
  });

  let table;

  describe("Check the defaults", function() {
    dt.html("basic");
    it("Returns an API instance", function(done) {
      table = $("#example").DataTable({
        columns: dt.getTestColumns(),
        ajax: "/base/test/data/data.txt",
        initComplete: function(settings, json) {
          expect(this.api().ajax.reload() instanceof $.fn.dataTable.Api).toBe(
            true
          );
          done();
        }
      });
    });
    it("Exists and is a function", function() {
      expect(typeof table.ajax.reload).toBe("function");
    });
  });

  describe("Functional tests", function() {
    dt.html("empty");
    it("Setup empty table", function(done) {
      table = $("#example").DataTable({
        columns: dt.getTestColumns(),
        ajax: "/base/test/data/data.txt",
        initComplete: function(settings, json) {
          table.clear();
          expect(table.rows().count()).toBe(0);
          done();
        }
      });
    });
    it("No args, data is loaded", function(done) {
      table.one("draw", function() {
        expect(table.rows().count()).toBe(57);
        done();
      });
      table.ajax.reload();
    });
    it("Callback can be null", function(done) {
      table.clear().draw();
      table.one("draw", function() {
        expect(table.rows().count()).toBe(57);
        done();
      });
      table.ajax.reload(null);
    });
    it("Callback is called with one argument", function(done) {
      table.ajax.reload(function callback() {
        expect(arguments.length).toBe(1);
        expect(typeof arguments[0]).toBe("object");
        done();
      });
    });
    it("Default for resetPaging is true", function(done) {
      table.page(1).draw(false);
      table.one("draw", function() {
        expect(table.page()).toBe(0);
        done();
      });
      table.ajax.reload();
    });
    it("ResetPaging is true", function(done) {
      table.page(1).draw(false);
      table.one("draw", function() {
        expect(table.page()).toBe(0);
        done();
      });
      table.ajax.reload(null, true);
    });
    it("ResetPaging is false", function(done) {
      let called = 0;
      table.page(1).draw(false);
      table.on("draw", function() {
        expect(table.page()).toBe(1);
        done();
      });
      table.ajax.reload(null, false);
    });
  });

  describe("Functional tests - callback", function() {
    dt.html("basic");
    it("Setup table", function(done) {
      table = $("#example").DataTable({
        ajax: function(data, callback, settings) {
          callback({ data: [[new Date().getTime(), "2", "3", "4", "5", "6"]] });
          done();
        }
      });
    });
    it("Callback called after table updated", function(done) {
      let before = table.cell(0, 0).data();
      table.ajax.reload(function callback() {
		let after = table.cell(0, 0).data();
        expect(parseInt(after)).toBeGreaterThan(parseInt(before));
        done();
      });
    });
  });
});
