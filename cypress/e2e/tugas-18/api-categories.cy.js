describe('API Automation Testing - Platzi Fake API (Categories)', () => {
  const baseUrl = 'https://api.escuelajs.co/api/v1/categories';
  let categoryId;

  it('TC_API_01: GET - Mengambil semua daftar kategori', () => {
    cy.request('GET', baseUrl).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
    });
  });

  it('TC_API_02: GET - Mengambil data 1 kategori spesifik (ID: 1)', () => {
    cy.request('GET', `${baseUrl}/1`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.id).to.eq(1);
      expect(response.body).to.have.property('name');
    });
  });

  it('TC_API_03: GET - Mengambil produk berdasarkan ID Kategori (ID: 1)', () => {
    cy.request('GET', `${baseUrl}/1/products`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('TC_API_04: POST - Membuat kategori baru (Data Valid)', () => {
    const payload = {
      name: "Kategori Otomatis",
      image: "https://placeimg.com/640/480/any"
    };

    cy.request('POST', baseUrl, payload).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.name).to.eq(payload.name);
      categoryId = response.body.id;
    });
  });

  it('TC_API_05: PUT - Memperbarui nama kategori yang baru dibuat', () => {
    const updatePayload = {
      name: "Kategori Terupdate QA"
    };

    cy.request('PUT', `${baseUrl}/${categoryId}`, updatePayload).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq(updatePayload.name);
    });
  });

  it('TC_API_06: DELETE - Menghapus kategori yang baru saja dibuat', () => {
    cy.request('DELETE', `${baseUrl}/${categoryId}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(String(response.body)).to.eq('true');
    });
  });

  it('TC_API_07: GET - Validasi pencarian kategori yang sudah dihapus', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/${categoryId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 404]);
    });
  });

  it('TC_API_08: POST - Gagal membuat kategori karena body kosong (Negative Case)', () => {
    cy.request({
      method: 'POST',
      url: baseUrl,
      body: {},
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 500]);
    });
  });

  it('TC_API_09: POST - Gagal membuat kategori karena tidak ada URL image', () => {
    const badPayload = { name: "Tanpa Gambar" };

    cy.request({
      method: 'POST',
      url: baseUrl,
      body: badPayload,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.message).to.be.an('array');
      expect(response.body.message[0]).to.include('image');
    });
  });

  it('TC_API_10: PUT - Gagal memperbarui kategori dengan ID yang tidak valid (String)', () => {
    cy.request({
      method: 'PUT',
      url: `${baseUrl}/id-salah`,
      body: { name: "Test" },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('TC_API_11: DELETE - Gagal menghapus kategori dengan ID yang tidak ada', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseUrl}/9999999`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it('TC_API_12: GET - Validasi struktur (Schema) property pada data kategori', () => {
    cy.request('GET', `${baseUrl}?limit=1`).then((response) => {
      expect(response.status).to.eq(200);
      const firstItem = response.body[0];
      expect(firstItem).to.have.property('id').that.is.a('number');
      expect(firstItem).to.have.property('name').that.is.a('string');
      expect(firstItem).to.have.property('image').that.is.a('string');
    });
  });
});