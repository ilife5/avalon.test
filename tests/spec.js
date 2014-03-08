define([], function() {


    describe('isWindow', function() {

        it('be', function() {
            expect(avalon.isWindow(1)).to.be(false)
            expect(avalon.isWindow({})).to.be(false)
            //自定义的环引用对象
            var obj = {
            }
            obj.window = obj

            expect(avalon.isWindow(obj)).to.be(false)
            expect(avalon.isWindow(window)).to.ok()


            var iframe = document.createElement("iframe")
            document.body.appendChild(iframe)
            var iwin = iframe.contentWindow || iframe.contentDocument.parentWindow
            //检测iframe的window对象
            expect(avalon.isWindow(iwin)).to.ok()
            document.body.removeChild(iframe)
        })

    })

    describe('isPlainObject', function() {

        it('be', function() {
            //不能DOM, BOM与自定义"类"的实例
            expect(avalon.isPlainObject([])).to.be(false)
            expect(avalon.isPlainObject(1)).to.be(false)
            expect(avalon.isPlainObject(null)).to.be(false)
            expect(avalon.isPlainObject(void 0)).to.be(false)
            expect(avalon.isPlainObject(window)).to.be(false)
            expect(avalon.isPlainObject(document.body)).to.be(false)
            expect(avalon.isPlainObject(window.location)).to.be(false)
            var fn = function() {
            }
            expect(avalon.isPlainObject(fn)).to.be(false)
            fn.prototype = {
                someMethod: function() {
                }
            };
            expect(avalon.isPlainObject(new fn)).to.be(false)
            expect(avalon.isPlainObject({})).to.be.ok()
            expect(avalon.isPlainObject({
                aa: "aa",
                bb: "bb",
                cc: "cc"
            })).to.be.ok()
            expect(avalon.isPlainObject(new Object)).to.be.ok()
        })

    })


    describe('isArrayLike', function() {

        function isArrayLike(obj) {
            if (obj && typeof obj === "object" && !avalon.isWindow(obj)) {
                var n = obj.length
                if (+n === n && !(n % 1) && n >= 0) { //检测length属性是否为非负整数
                    try {
                        if ({}.propertyIsEnumerable.call(obj, "length") === false) { //如果是原生对象
                            return Array.isArray(obj) || /^\s?function/.test(obj.item || obj.callee)
                        }
                        return true
                    } catch (e) { //IE的NodeList直接抛错
                        return true
                    }
                }
            }
            return false
        }

        it('be', function() {
            //函数,正则,元素,节点,文档,window等对象为非
            expect(isArrayLike(function() {
            })).to.be(false);
            expect(isArrayLike(document.createElement("select"))).to.be(true);

            expect(isArrayLike("string")).to.be(false)
            expect(isArrayLike(/test/)).to.be(false)

            expect(isArrayLike(window)).to.be(false)
            expect(isArrayLike(document)).to.be(false)

            expect(isArrayLike(arguments)).to.be.ok()
            expect(isArrayLike(document.links)).to.be.ok()
            expect(isArrayLike(document.documentElement.childNodes)).to.be.ok()
            //自定义对象必须有length,并且为非负正数
            expect(isArrayLike({
                0: "a",
                1: "b",
                length: 2
            })).to.be.ok()

        })

    })

    describe('range', function() {

        it('be', function() {
            expect(avalon.range(10)).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
            expect(avalon.range(1, 11)).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
            expect(avalon.range(0, 30, 5)).to.eql([0, 5, 10, 15, 20, 25])
            expect(avalon.range(0, -10, -1)).to.eql([0, -1, -2, -3, -4, -5, -6, -7, -8, -9])
            expect(avalon.range(0)).to.eql([])
        })

    })

    describe('oneObject', function() {

        it('be', function() {
            expect(avalon.oneObject("aa,bb,cc")).to.eql({
                "aa": 1,
                "bb": 1,
                "cc": 1
            })
            expect(avalon.oneObject([1, 2, 3], false)).to.eql({
                "1": false,
                "2": false,
                "3": false
            })
        })

    })

    describe('slice', function() {

        it('be', function() {
            var a = [1, 2, 3, 4, 5, 6, 7]
            expect(avalon.slice(a, 0)).to.eql(a.slice(0))
            expect(avalon.slice(a, 1, 4)).to.eql(a.slice(1, 4))
            expect(avalon.slice(a, -1)).to.eql(a.slice(-1))
            expect(avalon.slice(a, 1, -2)).to.eql(a.slice(1, -2))
            expect(avalon.slice(a, 1, NaN)).to.eql(a.slice(1, NaN))
            expect(avalon.slice(a, 1, 2.1)).to.eql(a.slice(1, 2.1))
            expect(avalon.slice(a, 1.1, 4)).to.eql(a.slice(1.1, 4))
            expect(avalon.slice(a, 1.2, NaN)).to.eql(a.slice(1, NaN))
            expect(avalon.slice(a, NaN)).to.eql(a.slice(NaN))
            expect(avalon.slice(a, 1.3, 3.1)).to.eql(a.slice(1.3, 3.1))
            expect(avalon.slice(a, 2, "XXX")).to.eql(a.slice(2, "XXX"))
            expect(avalon.slice(a, -2)).to.eql(a.slice(-2))
            expect(avalon.slice(a, 1, 9)).to.eql(a.slice(1, 9))
            expect(avalon.slice(a, 20, -21)).to.eql(a.slice(20, -21))
            expect(avalon.slice(a, -1, null)).to.eql(a.slice(-1, null))
        })

    })

    describe('textNode.nodeValue === textNode.data', function() {

        it('be', function() {

            var element = document.createElement("div")
            element.innerHTML = "zzzz<!--yyy-->"
            document.body.appendChild(element)
            var first = element.firstChild
            expect(first.nodeType).to.be(3)
            expect(element.lastChild.nodeType).to.be(8)
            first.data = "xxx"
            expect(first.nodeValue).to.be("xxx")
            expect(element.innerText || element.textContent).to.be("xxx")
            expect(first.nodeValue).to.be(first.data)
            expect(element.lastChild.nodeValue).to.be(element.lastChild.data)
            document.body.removeChild(element)

        })
    })
    describe('/\w\[.*\]|\w\.\w/', function() {
        it('be', function() {
            var reg = /\w\[.*\]|\w\.\w/
            //用于ms-duplex
            expect(reg.test("aaa[bbb]")).to.be(true)
            expect(reg.test("aaa.kkk")).to.be(true)
            expect(reg.test("eee")).to.be(false)
        })

        it("async", function(done) {
            var model = avalon.define('test', function(vm) {
                vm.aaa = {
                    xxx: "444",
                    yyy: "555"
                }
                vm.bbb = "yyy"
                vm.ccc = "text";
            })
            var body = document.body
            var div = document.createElement("div")
            div.innerHTML = ['<input ms-duplex="aaa[\'xxx\']">',
                '<input ms-duplex="aaa[bbb]">',
                '<input ms-duplex="ccc"/>',
                '<p>{{ccc}}</p>',
                '<p>{{aaa.xxx}}</p>',
                '<p>{{aaa.yyy}}</p>'].join('')
            body.appendChild(div)
            avalon.scan(div, model)

            setTimeout(function() {
                var ps = div.getElementsByTagName("p")
                expect(ps[0].innerHTML).to.be("text")
                expect(ps[1].innerHTML).to.be("444")
                expect(ps[2].innerHTML).to.be("555")
                model.ccc = "change"
                expect(ps[0].innerHTML).to.be("change")
                body.removeChild(div)
                done()
            }, 300)

        })

    })



})
