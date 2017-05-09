start=a:(_(num/key)_)+{return a.map(x=>x[1])}
num=a:$(int"."?/int?"." int){return +a}
int=$[0-9]+
key=$[^0-9. ]+
_=' '*
