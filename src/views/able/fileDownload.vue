<template>
  <el-card shadow="never">
    <div class="flex flex-wrap gap-y-3">
      <el-button
        @click="
          downloadImgByUrl(
            'https://img0.baidu.com/it/u=3906269906,2494252993&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500'
            // 'corgi.png'
          )
        "
      >
        下载在线图片
      </el-button>

      <el-button @click="downloadByBase64(base64, 'test.png')">基于 base64 下载图片</el-button>

      <el-button
        @click="
          downloadFileByUrl(
            'https://github.com/xiaoxian521/xiaoxian521/archive/refs/heads/main.zip'
          )
        "
      >
        根据文件在线地址下载文件(a标签获取)
      </el-button>

      <el-button
        @click="
          downloadFileByUrlNoOrigin(
            'http://static.shanhuxueyuan.com/demo/excel.xlsx',
            'test-111.xlsx'
          )
        "
      >
        根据文件在线地址下载文件(ajax获取)
      </el-button>

      <el-button @click="downloadFileByApi">根据后台接口文件流下载</el-button>

      <el-button @click="downloadImgZip(imgUrlList)">多个在线图片下载成Zip</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import axios from 'axios'
import {
  downloadByData,
  downloadImgByUrl,
  downloadFileByUrl,
  downloadFileByUrlNoOrigin,
  downloadByBase64,
  downloadImgZip
} from 'pear-common-utils'

const base64 =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCACvAIQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDn18Q6dZ/uvtyzp/CyMNwH90/41ZXUpNQuWktdPldJECjDqc4rzm60OayuzbTGJZMBuMMMH6UlqLzTZN8U6GMsA6EkI3scVyKlHoaHpBuyHMBYLcRcNExG5fypIJlkt7oyYAZx8x6jHpWJpdnZ3Nv9ttNMnubjOHQH5YX/AMPrW5ZWf9tW0iXU3kxwSAT20BGWJzgsw7HBqJQsy+UpSaiIUkI/e3VwwLKg3MAOAMCpFtNXuUxEjWiMuGZwN2D149a6C0jsbGK7jEMFgtvEJpJCNoaPOM7up54xVuFre8g+1WV5b3cPUtDIDt+o6ily6XQrK5wfiLwtcWelreabdyyrAo82B1BKjuw9qi8E+ObXQNPuLS/ieUSTebGy4AHHPX8K9CZlUHdjDDBU9CO4ry69tNPtdSu7O40yBxGxZHQlSVPToa1pyVrMmVuh09147v7aXUtRs00+eN7pXjR2LS8rtx8pHT6Vhad4E19ppDsjt5JojOZGz8oPIXHXNP03wfZyajps0qXNrbzSgh94bBHIHTIJr2uPTxJeRy/Muz5SGPLADjJNae0tsCptnzzN4L1Gz8MnX5pItnm+WYurAdMn0q74DtjbeKLQi4jYMk4KrnP+pfmvXPFHh5v+Ff6jY2aJJPJIZQi/XOK81+H9nLF420q1n0u5tmleQCWQnacxsMenerUriasc3YFTBDusXGQF84Hf/wCO1pRWl7e3X2ez065vrgAEIEyFB6HA6fjQiy2dlA4DyI5aNfJ4yQcbSRzmtCHQ9ZtE+0yXq+G7WaPJke4ZZJgf4dqne1RZNhcfb+GbiGV5NbvxabRgW1syvKTjptHCj6+lUl8ORmESx6lMySZKt5akGqXiQXOlTJbx3bzWFwoeNxGYt5HByOD1z1re8Hzq/hWSKSQjyLsgDGdqsqn+eamqlFXQzP8A7ElGAL8dO8VFdMIt3Ii3DsxGM0Vy87GchqZaTxDdEj+FF59lBrqPC2teHoPDM2kawsqwzXEhmP2cum09MEcgiuY1RYpNbTLqBPCh3E9CBg1YsQtrGLdFupw7HHkwlz/KumL0A1LDwhFJcXSWfi3That0UTMssi9gUOOfrXTWFvpHg7Sp38wr5pBleRgWlIzgAD6n865GYwxJme1mRQf+W9sy/wBMfrVNrm3Cbo4lYZ/u7sUneQiXxB4vn1JvKkIWBQHSJB97B4z6mug8E39jPpt0qQJHqcj7p37yJ2I/rXNpZPqJ3xaWGMfSQDbj+lSWlmumzRzQ6ii3MTM4ijjMxOf4TjgD8atR92yJtZndXMu0jPWuD16MNqMcoPLqyHPt0rRPiO/bHn2lse3yEqfxzWLqExuZlladQIyW2KpP61l7OVxno/h5R4h8K2cL3Ci4t7hHbjlip4/CvRZ3HlnMgyeoFeG6O+paPLFeWbRT28yh9gfaa7yw8R/a2jicGNj13UG62OlkaPyXic/LIpBrynw3cT2fxA07T2nk2xagE2ljjBzjr9a73WNb0rw1pv8AaWryM27/AI97ZPvTEfyHqa8oi8ay618RdL1W9t7e0hS8hJSJcBFDDqe9aKLepnJoih1CTw/qEWoWR8q11ASRug52SAkEqT909Ofesm68U38krTQ+Xbu3BkX55SPd2yfyq5r/AJdtp0tujiQW2qyBSDxjJ/wrFFivBzkHmtL6EIgikmvLvdcSyStgndIxJrufh/LFnVIWAILRtz2wCK5GSMQwSOBggcVZ8JXJTUpCGZd+1TtNTPWIz2H7MjAHeMEcYNFcyl5NgqDkKSATyaK47DNjS9K0e8n+0a1IsNrGfLigjXDO3cluwro9ClY61NLZawkOj2mFNpHEHJYjpvqHSLqGzt2tpLGGdpH3gyrnBrqoIC8SrFaxoCN5WJABk9TVxvY00sc1qxVNQD2hZI5BuKMcjP0rFv8Aw7p2rjJAsL8cxXdsu3DejKOCK6bXNPmgmjm2Hy3HX0rL+7z2qHKUXclo84iu72DVZ9G1+2SbUNv+jTSyssTY/wBkYBJ7Emn/AGe8EUf2maK0gUfcBA/ICtD4hQJdaXFcIv7+AlkcdsYJFcDdXtxeTtJJI7blB6+1dcJ80bmZu3d5ottbXKYkuJZU2pM3yiM5zkDue341WtNNvdRVUtoSsZyGncfKBisU280sLLt2rtOCTXrdgsh0XTWgAUtaxlm9TtGacp2QWM+xsXtNMt7aYxT+THsDqpGR+NTBYIChUFnPQDoPrV/7JLJJul3SH68VZi05Tz5YXFc19bstOyPH/F2q6rqmutLqm9CgCQxsMBEHQCsTPHcV7R4u8LWuq+HLifiO8tkMsbE9QOoNeKoTn5+tddOSkiJaMtxXG+JoZDuEj7zk859a3J7UxxwzxSJNayj5JUPIPdWHY1zPRs1dguNuCGYeozwatpMVy/cjNrIP9mq/hn/kJ/iKtMyyQ9eG4NR6XBJZ3E0iDzORjYOayls0NHawnKsRzljRVGC6RIVDrLu6n5aK5LFHoFvEqziCdyEbLJJ3AHNea+LviVrWvzvbWt1LY6Uh2RwQsUZlHdyOSTXeT3R/dsp+ZG3CvK/GFuln4suxBGBDMfNiXsAef55raha4TIdA1ybRtbtb15JZIlfEiM5YMp4P+NetW+v6drZkTTbnf5a73VlKlV9ea8PVgHwq+c5/IVraddtbTPDuETXKeW5R85XIOD+IFa1aalqTFnZalqaatd3kER3WttaS4bs745Ncrp8avp0EmAWK8k/WtSxAiS9UcAWkgx+FZ2lf8ge1Ps3/AKEamCtEVxLuVLdNrLuJHAFei+D9RjvfD1ijkh44gpz7cV5pqU2InRoULH5lc/eWuk8NM8dhbbVdmSLcAoznvSmvdKueive20XGQT7VnT60+WWKMAD+LNZFxdW9lBFe6zqFvHDMheK2gk3zP257L+Nc23jnT4GwNNmkXOF3yjcR78VlyN7DOta7uLo8ksDwfeuC8daBdWOof2sIx9jvG4KjhGxytdFH8SND2woNJlhPRy7hl/Tmln3+JPD94kWp/bFky0aFjtjfOQAD044rSClCWonqeYA5qRCKjZGhkeORSsiEqykYII6ilBrqMy/ZSgS+Ux+VuhJ710egQmUXYGAylefzrkVI656V1/hIXl5cXMVhp8t5KyKxVMBV92J6VnOOhSZrGFR1lA/EUVuJ4P1+Rd8mqWNqx5MUaFwPx70Vzcg+ZHMN4usPKxDa37sB1Z1UVzmv6pJq9xHdNbrF5Ufl5D7ieT1P41S3t3xTpE821nTPIG4e9awjFbBLVGeHKqEjyA33iOpqeNFUoFjJfORt6/nUKfSplYKQTk+wOK3toQdVZSrNa3MijrauD7cVT0oH+x7YezfzNVdK1IWQuUeISRzwNGAjcqT35q7ppC6Xbr6Aj9TWbVkCKeqD5d+P4DW/Zah/Y/h2PUMZdIQqD1Yisy7gNxbsgOGq+2nNf6LpmmElZZZY1IHpyCfypepaVzi3FzeTNKEkld2yxCk8mpTb3duUV7SVWbgFkOa9th0HTbO1itreDCw9GHVj7+tWLi0iLBpIU4HBZeRRzo1VE8Blyz4K7WHWrukatNpE8hRiPMXHPQHsa7XxP4fglv/tdsvVfmXGOa47VNLliBbyyCmN3401K5ElY3/iNHb3GqWutWew2+oQIzOgwGkAG449c1xgNbd9qIuPCGm2XlTBraaRjIV+Rt2OAfwrCrRGT0JAwrufhTefZvHVrAS3lXsbwMoPByOP1FcFkVcsb6fT7y3u7Vyk8EivGw7EGmB9RCFQMYBwfSir8simTIjAJVS2BjkgE/wA6KwcQPlQcMPmBYdatQMDJgY5H51PqYhu7hHgyI1GDsh2KfpTYRAuAo59waVrDMm7RoLuRMDaTkfSmBwOa1dRsEuIRPagbox86juKxPSt4vQTLkLRl9zDpySelbWnXqygxrFhVHDHoTXNk4TA7mrDXLKFO4qo7DjNDQHTSSDa67udprprEzxNpstpbwTXCMmxJ32J9Sa4WDWVwPPtlUMMKV616Zpeg6jd6dBd3cNpFZyW/mLBJKDLPHjqFrFxdy4s2bnUdSmiuI4LW2tLqNd4KTrNGB3II/rWAl9pdvy+rX1/qTHbIWibYD6D2rZs9PtdIs9QeBLeGS4SOIozrGAM54zipbOS3mildIkDxOUccHB78jrUM60tCiY1WL9+AcisGWPTi076hbieDhFjaQopY9MsOcVrancbrpIlBJPArnZ/FeiILzSJ1uEjlPlS3SKrjHfCn+eaIXZFSyOQ8S2b6XqstgFMVuSJUhEhZVyOxPX61hsMcVv8Aia90+6v7dNNmmubeC3EQluI9jNgnGRn0NYLdeldKOWQwdat2qSS3EKQoXlaRQijqTngVUzg1NDLJE6Sxkq8bB1YdiO9Mk9dl8eeJ9Pme2u7DV450OGVQjqPoWQnH40Vw8fxK8WxJtGruR6sik/yooshkzPDHkSySQMe0qMtSobZyu2/j99hJP4V2UEF47qsWqIylsBZ5cH8mFKdesbZJoA17NeROUZLe1UKSP9vgYrFAZth4ck1CBpMo3y8IDg49T71yXi3wjd+H5IbvyybKckIw/hb+6fevYdE+zz6bDeRhszr8245II6itK40mDW9LutLu1Bt7ldoLD7j/AMLfgapMD5mY9PrT0WSe6jjjTc5OAKuazpF3oep3GnX0bRzwNg5GMjsR7GqSSmN9yHBIxmtANo3sekuVs/LkvF4kuWUEIfRB/WqUGqXMOq2t958sj28iuN7E4wc8e1V4mVS0jKGCDgH1piMuC7Hls0twW57JrT6HqGs211eadd3888ImhWBNy+WfUfWpLa+sU22lhZ3FpEBnZJFsGfzrh/D+p22qWQ0a/luAYRm3li6hRyQcVvR3+hafB/osE87RrlmCMQPqTwKylE7IT0NHXdQg0jRpr4n/AEhh5cI77j3rxxiWck55OSTWv4h16fWr7JOIIziJPQetY7H+Ec1cI2Rz1JXYjsWOR0HApN3FOIAjA/OozVmQZqRXKqwHcYqKlBoAKKSigZ9Uyxx3afvYoLn/AK6KslULnw5oUwYvotssj/eaBmhYfTBrcNzBKf8ASdEsJTnJMWYyT+tNEejtx5OrWXc+TPvX8jn+VYK3cDMsbO10+0jtLW38uGP7qlt315q/BdRq3/Hs2R3pWtbZ+LbxFGOel7Zj8srtp8dhqL58uOwvFBwXtbzaR/wFh/WmBleLfDeleN9MMdw6walEP9FuSO/91j3B/Svm3U9Ou9M1CaxvIjFcQOUdWHcV9TTWl1DnfpN8i92KK4/8dNcJ8U7DR7zwqup3gaDVIJFhhcIQ03qrbsZx61cX0A8PdgsGwdzmoParICn3qR7YCDzyyqA23g8k/SrAiguJ7aSN4JGjkjbKMhwQa0dT8SatqMAtbm/kliHVMBQfrjrWWzhdxH3j39KWJMZdvwoHdgI9oyetAGTjH40McmlBwOBzQSMfpUZp7Zx16UzHNIBKKKKYwopKKAPrbbRinZoI5rlJGEeoB+tVbu1jkh3bVXa6scDHGau1DOM20n4H9aBkgkuYiTDdzxk+jk/zrxj4ya5d3viqLR5rt7iLTolUswALSMAxJxx3A/CvbIQHuEB4UEMT7d6+YvEt8dT8U6pqAAxPdSOMem44rWAGWT5Ypsk5dNvHHtTWVycmnxwgDLcVqMIoxje34Chs556elK7Anjmm8luaBCj2pDwaXoKaRQA09DSHkinGmUgDsaaetO9aaaYwFFAzjvRQB9ZmQKyqfvEZp5NMwCMnqO9KDmuW5IuaZKf3Eg/2TT8ik8szExr1cYH1Of8A61AGR4q1xPD/AIRu9SJxNOv2a2A6l2HX8BXzptXdkknHTmu6+KniL+19bh0y3lD2Olp5YK9HlP3z+fH4VwQbJBJreKsMc+wDJ/KqrOWNLIxdsdhQFAHTmrAQDinDpz0pDhRlqZu3HrQA/OeO1Nfvj+8aN2FxSOeD9c0AJ6+1N9frSk8n6U3vQAHoabSnrSUDHDpRSA8UUAe52vxTcRyNqOiWzohCsbWd0cH/AHWB5/KttvHnh+CZY7hb6zd2UKZIhIpzz1U+/pXERzXVtrBGu3E0MksYL3S7XZnB64Hp0qvrVzba3LZ2sN2by4iV0mma3EPQ5BAHf3rJodj1K217RLyXZba3ZGXJHlyuY2z9GAqe/wBQ/s7RdQ1MPGRb2zvG6uCpfGF/WvFrho5TFGYmGpGQOzrgjHY89/WoPErf8SqzuharaS3EjLcxxOdkhGMEDOAD6UlFNiaOYmkd9zs25mbcxPcnrUGcOBipdysxzkUbFRNx5rVCIcd6QsE56mmvLuOEGBTVjLc0wAku2adtCinfdHFMZqAGEnOaM0E0lACnvSUGkoGJRRRQBYjKbPmVSfc0VYtJoY4MPaRSnP3mJzRQB//Z'

// PDF不能使用在线url直接下载, 需要接口返回流数据才能下载

function downloadFileByApi() {
  const url = 'https://xiaoxian521.github.io/hyperlink/img/pure.png'

  axios({
    method: 'GET',
    url,
    responseType: 'blob',
    withCredentials: false
  })
    .then(res => {
      downloadByData(res.data, 'test.png', res.headers['content-type'])
    })
    .catch(err => {
      console.log('err', err)
    })
}

const imgUrlList = [
  'https://avatars.githubusercontent.com/u/499550?s=64&v=4',
  'https://img0.baidu.com/it/u=3906269906,2494252993&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500',
  'https://xiaoxian521.github.io/hyperlink/img/pure.png'
  // 'http://image-demo.img.aliyuncs.com/example.jpg@!pipe1',
  // 'http://image-demo.img.aliyuncs.com/example.jpg',
  // 'https://www.leaferjs.com/ui/image/demo/mary.jpg',
  // 'https://www.leaferjs.com/ui/image/blog/20240408/seed.jpg',
  // 'https://www.leaferjs.com/ui/image/blog/20240408/mountain.jpg'
]
</script>

<style lang="scss" scoped></style>
