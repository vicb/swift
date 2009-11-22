
describe '$.swift'
  describe '.version'
    it 'should be a triple'
      $.swift.version.should.match(/^\d+\.\d+\.\d+$/)
    end
  end
end