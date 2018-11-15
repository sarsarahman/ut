const proxyquire = require('proxyquire');


describe('The ./lib/expandNamespaces function', () => {

  it('should keep paths without namespaces unchanged', () => {

    const expandNamespaces = proxyquire('../lib/expandNamespace', {
      './loadNamespaces': sinon.stub()
    });

    const expected = './somePath';
    const actual = expandNamespaces(expected);

    expect(actual).to.equal(expected);

  });


  it('should return an error if existing namespaces are null', () => {

    const expandNamespaces = proxyquire('../lib/expandNamespace', {
      './loadNamespaces': sinon.stub()
    });

    const expected = '<universal>/somePath';

    expect(() => {

      expandNamespaces(expected);

    }).to.throw(TypeError);

  });


  it('should return an error if new module namespace is not defined in existing namespaces', () => {

    const expandNamespace = proxyquire('../lib/expandNamespace', {
      './loadNamespaces': sinon.stub().returns({
        namespaces: {
          lib: './lib',
          src: 'src'
        }
      })
    });

    const expected = '<someNamespace>/somePath';

    expect(() => {

      expandNamespace(expected);

    }).to.throw('namespace <someNamespace> is not defined.');

  });

  it('should return the correct new relative path based on the expanded namespace', () => {

    const expandNamespace = proxyquire('../lib/expandNamespace', {
      './loadNamespaces': sinon.stub().returns({
        namespaces: {
          lib: './lib',
          src: 'src'
        }
      })
    });

    const callerPath = require('caller-path');
    const modulePath = '<lib>/test/one';

    const expected = '..\\..\\..\\..\\lib\\test\\one';
    const actual = expandNamespace(modulePath, callerPath());

    expect(actual).to.equal(expected);

  });

  it('should appends "./" if it doesn\'t start with it', () => {

    const expandNamespace = proxyquire('../lib/expandNamespace', {
      './loadNamespaces': sinon.stub().returns({
        namespaces: {
          lib: './lib',
          src: 'src'
        }
      })
    });

    const callerPath = require('caller-path');
    const modulePath = '<src>/test/two';

    const expected = '..\\..\\..\\..\\src\\test\\two';
    const actual = expandNamespace(modulePath, callerPath());

    expect(actual).to.equal(expected);

  });

});
