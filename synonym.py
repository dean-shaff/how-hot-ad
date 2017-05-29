import json

import requests
# from nltk.corpus import wordnet

# SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
ALTERVISTA = True

pos_equiv = {
			'adj':'adjective',
			'adv':'adverb',
			'noun':'noun',
			'verb':'verb'
			}

# with open(os.path.join(SITE_ROOT,'static/data/existing_synonyms.json')) as f_syn:
# 	existing_synonyms = json.load(f_syn)

existing_synonyms = {}

word_api_key = "02731985e9b675481c90357e4efe13b9"
altervista_api_key = "BvnMOCQPDTrhARj5475X"

def get_api_synonym(word, pos='adj'):
	client = requests.session()
	if word in existing_synonyms:
		return existing_synonyms[word]

	if ALTERVISTA:
		template = "http://thesaurus.altervista.org/thesaurus/v1?key={}&word={}&language=en_US&output=json"
		resp = client.request("GET", template.format(altervista_api_key, word))
		if resp.status_code == 200:
			resp_list = resp.json()['response']
			synonyms = []
			for ele in resp_list:
				if ele['list']['category'] == "({})".format(pos):
					words = ele['list']['synonyms'].split("|")
					for word in words:
						if ("(similar term)" not in word and
						 	"(related term)" not in word and
							"(antonym)" not in word and
							len(word.split(" ")) == 1):
							synonyms.append(word)
			synonyms = list(set(synonyms))
			existing_synonyms[word] = synonyms
			# synonyms = [ele['list']['synonyms'].split("|") for ele in resp_list if ele['list']['category'] == "({})".format(pos)]
			# synonyms = [word for sublist in synonyms for word in sublist if "(similar term)" not in word and "(related term)" not in word]
		else:
			synonyms = [word]
		return synonyms
	else:
		template = "http://words.bighugelabs.com/api/2/{}/{}/json"
		resp = client.request("GET", template.format(word_api_key, word))
		if resp.status_code == 200:
			resp_list = resp.json()
			synonyms = resp_list[pos_equiv[pos]]['syn']
			synonyms = list(set(synonyms))
			existing_synonyms[word] = synonyms
		else:
			print("Error: {}".format(resp.status_code))
			synonyms = [word]
		return list(set(synonyms))


# def get_synonym_wordnet(word, pos=wordnet.ADJ):
#
# 	synsets = wordnet.synsets(word, pos=pos)
# 	for synset in synsets:
#
# 		lemma = synset.lemmas()
# 		synonyms = [l.name() for l in lemma]
#
# 		print(synset, synonyms)
#
#
# if __name__ == '__main__':
# 	print(get_synonym('burning'))
# 	ALTERVISTA = False
# 	print(get_synonym('burning'))
# 	# get_synonym_wordnet('ardent')
