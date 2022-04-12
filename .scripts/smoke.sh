#!/bin/bash

PORT="${1:-4000}"
TESTS=(1 2 4)

# --------------------------------------------------------------------
# TEST 1
# --------------------------------------------------------------------
DESCR_1="allProducts with delivery"
OPNAME_1="allProdDelivery"
read -r -d '' QUERY_1 <<"EOF"
{
  allProducts {
    delivery {
      estimatedDelivery,
      fastestDelivery
    },
    createdBy {
      name,
      email
    }
  }
}
EOF

OP_1=equals

read -r -d '' EXP_1 <<"EOF"
{"data":{"allProducts":[{"delivery":{"estimatedDelivery":"6/25/2021","fastestDelivery":"6/24/2021"},"createdBy":{"name":"Apollo Studio Support","email":"support@apollographql.com"}},{"delivery":{"estimatedDelivery":"6/25/2021","fastestDelivery":"6/24/2021"},"createdBy":{"name":"Apollo Studio Support","email":"support@apollographql.com"}}]}}
EOF

# --------------------------------------------------------------------
# TEST 2
# --------------------------------------------------------------------
DESCR_2="allProducts with totalProductsCreated"
OPNAME_2="allProdCreated"
read -r -d '' QUERY_2 <<"EOF"
{
  allProducts {
    id,
    sku,
    createdBy {
      email,
      totalProductsCreated
    }
  }
}
EOF

OP_2=equals

read -r -d '' EXP_2 <<"EOF"
{"data":{"allProducts":[{"id":"apollo-federation","sku":"federation","createdBy":{"email":"support@apollographql.com","totalProductsCreated":1337}},{"id":"apollo-studio","sku":"studio","createdBy":{"email":"support@apollographql.com","totalProductsCreated":1337}}]}}
EOF

# --------------------------------------------------------------------
# TEST 3 - DISABLED FOR NOW - UNTIL WE ALLOW @inaccessible in subgraphs
# --------------------------------------------------------------------
DESCR_3="weight: Float @inaccessible should return error"
OPNAME_3="inaccessibleError"
read -r -d '' QUERY_3 <<"EOF"
{
  allProducts {
    id,
    dimensions {
      size,
      weight
    }
  }
}
EOF

OP_3=startsWith

read -r -d '' EXP_3 <<"EOF"
{"errors":[{"message":"Cannot query field \"weight\" on type \"ProductDimension\"
EOF

# --------------------------------------------------------------------
# TEST 4
# --------------------------------------------------------------------
DESCR_4="exampleQuery with pandas"
OPNAME_4="exampleQuery"
read -r -d '' QUERY_4 <<"EOF"
{
 allProducts {
   id,
   sku,
   dimensions {
     size,
     weight
   }
   delivery {
     estimatedDelivery,
     fastestDelivery
   }
 }
 allPandas {
   name,
   favoriteFood
 }
}
EOF

OP_4=equals

read -r -d '' EXP_4 <<"EOF"
{"data":{"allProducts":[{"id":"apollo-federation","sku":"federation","dimensions":{"size":"1","weight":1},"delivery":{"estimatedDelivery":"6/25/2021","fastestDelivery":"6/24/2021"}},{"id":"apollo-studio","sku":"studio","dimensions":{"size":"1","weight":1},"delivery":{"estimatedDelivery":"6/25/2021","fastestDelivery":"6/24/2021"}}],"allPandas":[{"name":"Basi","favoriteFood":"bamboo leaves"},{"name":"Yun","favoriteFood":"apple"}]}}
EOF

set -e

OK_CHECK="\xE2\x9C\x85"
FAIL_MARK="\xE2\x9D\x8C"
ROCKET="\xF0\x9F\x9A\x80"

printf "Running smoke tests ... $ROCKET $ROCKET $ROCKET\n"
sleep 2

for test in ${TESTS[@]}; do
  descr_var="DESCR_$test"
  query_var="QUERY_$test"
  exp_var="EXP_$test"
  op_var="OP_$test"
  opname_var="OPNAME_$test"

  DESCR="${!descr_var}"
  QUERY=$(echo "${!query_var}" | awk -v ORS= -v OFS= '{$1=$1}1')
  EXP="${!exp_var}"
  OP="${!op_var}"
  OPNAME="${!opname_var}"

  echo ""
  echo "=============================================================="
  echo "TEST $test: $DESCR"
  echo "=============================================================="

  ACT=$(set -x; curl -X POST -H 'Content-Type: application/json' --data '{ "query": "'"query $OPNAME${QUERY}"'", "operationName": "'"$OPNAME"'" }' http://localhost:$PORT/ 2>/dev/null)

  OK=0
  if [ "$OP" == "equals" ]; then
    [ "$ACT" == "$EXP" ] && OK=1

  elif [ "$OP" == "startsWith" ]; then
    EXP=$( echo "$EXP" | sed 's|\\|\\\\|g' | sed 's|\[|\\[|g' | sed 's|\]|\\]|g')
    if echo "$ACT" | grep -q "^${EXP}"; then
      OK=1
    fi
  fi

  if [ $OK -eq 1 ]; then
      echo -------------------------
      echo "[Expected: $OP]"
      echo "$EXP"
      echo -------------------------
      echo "[Actual]"
      echo "$ACT"
      echo -------------------------
      printf "$OK_CHECK Success!\n"
  else
      echo -------------------------
      printf "$FAIL_MARK TEST $test Failed! \n"
      echo -------------------------
      echo "[Expected: $OP]"
      echo "$EXP"
      echo -------------------------
      echo "[Actual]"
      echo "$ACT"
      echo -------------------------
      printf "$FAIL_MARK TEST $test Failed! \n"
      echo -------------------------
      exit 1
  fi
done
echo ""
echo "================================"
printf "$OK_CHECK ALL TESTS PASS! \n"
echo "================================"
echo ""
